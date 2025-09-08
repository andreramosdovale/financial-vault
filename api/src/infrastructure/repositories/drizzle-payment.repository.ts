import { desc, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import type {
  CreatePaymentDTO,
  IPaymentRepository,
} from "../../application/repositories/payment.repository";
import type { Payment } from "../../domain/payment.entity";
import { db } from "../../db/client";
import { payments } from "../../db/schema";

export class DrizzlePaymentRepository implements IPaymentRepository {
  async findAll(): Promise<Payment[]> {
    const result = await db.query.payments.findMany({
      orderBy: [desc(payments.createdAt)],
    });
    return result;
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await db.query.payments.findFirst({
      where: eq(payments.id, id),
    });
    return result ?? null;
  }

  async findByIdempotencyKey(key: string): Promise<Payment | null> {
    const result = await db.query.payments.findFirst({
      where: eq(payments.idempotencyKey, key),
    });
    return result ?? null;
  }

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const newPayment = {
      id: createId(),
      ...data,
      createdAt: new Date(),
    };

    await db.insert(payments).values(newPayment);
    return newPayment;
  }
}
