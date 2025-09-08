"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

interface PaymentData {
  amount: number;
  description: string;
}

interface PaymentResponse {
  id: string;
  amount: number;
  description: string;
  idempotencyKey: string;
  createdAt: string;
}

async function createPayment(
  paymentData: PaymentData
): Promise<PaymentResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const apiToken = process.env.NEXT_PUBLIC_SUPER_SECRET_TOKEN || "";

  const idempotencyKey = uuidv4();

  const response = await fetch(`${apiUrl}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(paymentData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    const error = new Error(
      responseBody.message || "Ocorreu um erro ao processar o pagamento."
    );
    (error as any).status = response.status;
    (error as any).data = responseBody;
    throw error;
  }

  return responseBody;
}

export default function PaymentPage() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useMutation<PaymentResponse, Error, PaymentData>({
    mutationFn: createPayment,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Math.round(parseFloat(amount) * 100);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    mutation.mutate({ amount: numericAmount, description });
  };

  const getErrorStatus = (error: Error | null): number | undefined => {
    return error ? (error as any).status : undefined;
  };

  const getErrorData = (error: Error | null): PaymentResponse | undefined => {
    return error ? (error as any).data : undefined;
  };

  const errorStatus = getErrorStatus(mutation.error);
  const errorData = getErrorData(mutation.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Financial Vault</CardTitle>
          <CardDescription>
            Insira os detalhes para registrar um novo pagamento.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (ex: 12.50)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Pagamento da fatura de energia"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Processando..." : "Enviar Pagamento"}
            </Button>

            {/* Seção de Alertas de Feedback */}
            {mutation.isSuccess && (
              <Alert
                variant="default"
                className="border-green-500 text-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Sucesso!</AlertTitle>
                <AlertDescription>
                  Pagamento criado com sucesso! ID: {mutation.data.id}
                </AlertDescription>
              </Alert>
            )}

            {mutation.isError && errorStatus === 409 && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Conflito (409)</AlertTitle>
                <AlertDescription>
                  Esta transação já foi processada. ID existente:{" "}
                  {errorData?.id}
                </AlertDescription>
              </Alert>
            )}

            {mutation.isError && errorStatus !== 409 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  Erro {errorStatus ? `(${errorStatus})` : ""}
                </AlertTitle>
                <AlertDescription>
                  {mutation.error.message ||
                    "Não foi possível completar a operação."}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
