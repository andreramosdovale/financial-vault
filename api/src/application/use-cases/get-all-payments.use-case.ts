import type { IPaymentRepository } from "../repositories/payment.repository";

export class GetAllPaymentsUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute() {
    const payments = await this.paymentRepository.findAll();
    return payments;
  }
}
