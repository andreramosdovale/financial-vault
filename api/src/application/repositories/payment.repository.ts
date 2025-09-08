import type { Payment } from "../../domain/payment.entity";

export type CreatePaymentDTO = Omit<Payment, "id" | "createdAt">;

export interface IPaymentRepository {
  findByIdempotencyKey(key: string): Promise<Payment | null>;
  create(data: CreatePaymentDTO): Promise<Payment>;
}
