import type { Payment } from "../../domain/payment.entity";

export type CreatePaymentDTO = Omit<Payment, "id" | "createdAt">;

export interface IPaymentRepository {
  findAll(): Promise<Payment[]>;
  findById(id: string): Promise<Payment | null>;
  findByIdempotencyKey(key: string): Promise<Payment | null>;
  create(data: CreatePaymentDTO): Promise<Payment>;
}
