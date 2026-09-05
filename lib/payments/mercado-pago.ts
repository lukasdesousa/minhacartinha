import { MercadoPagoConfig, Order, Payment } from "mercadopago";
import { getPaymentConfig, PIX_EXPIRATION, PREMIUM_PRICE_CENTS } from "./config";

export function mercadoPago() {
  const configuration = getPaymentConfig();
  const client = new MercadoPagoConfig({ accessToken: configuration.accessToken, options: { timeout: 10_000, maxRetries: 1, maxDelay: 1000 } });
  return { orders: new Order(client), financialPayments: new Payment(client), configuration };
}

export function pixOrderBody(externalReference: string, payerEmail: string) {
  const amount = (PREMIUM_PRICE_CENTS / 100).toFixed(2);
  return {
    type: "online",
    processing_mode: "automatic",
    total_amount: amount,
    external_reference: externalReference,
    description: "Minha Cartinha Premium — compra única desta cartinha",
    transactions: {
      payments: [{ amount, payment_method: { id: "pix", type: "bank_transfer" }, expiration_time: PIX_EXPIRATION }],
    },
    payer: { email: payerEmail },
  };
}
