import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { DrizzlePaymentRepository } from "./infrastructure/repositories/drizzle-payment.repository";
import {
  CreatePaymentUseCase,
  PaymentConflictError,
} from "./application/use-cases/create-payment.use-case";

const app = new Hono().basePath("/api");

const SUPER_SECRET_TOKEN = process.env.SUPER_SECRET_TOKEN || "";
app.use("/payments/*", bearerAuth({ token: SUPER_SECRET_TOKEN }));

const createPaymentSchema = z.object({
  amount: z.number().int().positive(),
  description: z.string().min(1).max(100),
});

app.post(
  "/payments",
  zValidator("json", createPaymentSchema),
  zValidator("header", z.object({ "x-idempotency-key": z.string().min(1) })),
  async (c) => {
    const body = c.req.valid("json");
    const { "x-idempotency-key": idempotencyKey } = c.req.valid("header");

    const paymentRepository = new DrizzlePaymentRepository();
    const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository);

    try {
      const newPayment = await createPaymentUseCase.execute({
        ...body,
        idempotencyKey,
      });
      return c.json(newPayment, 201);
    } catch (error) {
      if (error instanceof PaymentConflictError) {
        const existingPayment = await paymentRepository.findByIdempotencyKey(
          idempotencyKey
        );
        return c.json(existingPayment, 409);
      }
      // Logar o erro winston
      console.error(error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
