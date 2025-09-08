import type { IPaymentRepository } from "../repositories/payment.repository";

export class PaymentNotFoundError extends Error {
  constructor() {
    super("Payment not found.");
    this.name = "PaymentNotFoundError";
  }
}

export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(id: string) {
    const payment = await this.paymentRepository.findById(id);

    if (!payment) {
      throw new PaymentNotFoundError();
    }

    return payment;
  }
}
