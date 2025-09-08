import type {
  CreatePaymentDTO,
  IPaymentRepository,
} from "../repositories/payment.repository";

export class PaymentConflictError extends Error {
  constructor() {
    super("A transaction with this idempotency key already exists.");
    this.name = "PaymentConflictError";
  }
}

export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(data: CreatePaymentDTO) {
    const existingPayment = await this.paymentRepository.findByIdempotencyKey(
      data.idempotencyKey
    );

    if (existingPayment) {
      throw new PaymentConflictError();
    }

    const newPayment = await this.paymentRepository.create(data);
    return newPayment;
  }
}
