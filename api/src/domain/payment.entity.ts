export interface Payment {
  id: string;
  amount: number;
  description: string;
  idempotencyKey: string;
  createdAt: Date;
}
