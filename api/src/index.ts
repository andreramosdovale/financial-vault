import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { DrizzlePaymentRepository } from "./infrastructure/repositories/drizzle-payment.repository";
import {
  CreatePaymentUseCase,
  PaymentConflictError,
} from "./application/use-cases/create-payment.use-case";
import {
  GetPaymentUseCase,
  PaymentNotFoundError,
} from "./application/use-cases/get-payment.use-case";
import { GetAllPaymentsUseCase } from "./application/use-cases/get-all-payments.use-case";

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

      console.log("[LOG ROTA] Sucesso! Retornando para o cliente:", newPayment);

      return c.json(newPayment, 201);
    } catch (error) {
      if (error instanceof PaymentConflictError) {
        const existingPayment = await paymentRepository.findByIdempotencyKey(
          idempotencyKey
        );
        return c.json(existingPayment, 409);
      }

      console.error(error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

app.get("/payments/:id", async (c) => {
  const id = c.req.param("id");

  const paymentRepository = new DrizzlePaymentRepository();
  const getPaymentUseCase = new GetPaymentUseCase(paymentRepository);

  try {
    const payment = await getPaymentUseCase.execute(id);
    return c.json(payment, 200);
  } catch (error) {
    if (error instanceof PaymentNotFoundError) {
      return c.json({ message: error.message }, 404);
    }
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.get("/payments", async (c) => {
  const paymentRepository = new DrizzlePaymentRepository();
  const getAllPaymentsUseCase = new GetAllPaymentsUseCase(paymentRepository);

  try {
    const payments = await getAllPaymentsUseCase.execute();
    return c.json(payments, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
