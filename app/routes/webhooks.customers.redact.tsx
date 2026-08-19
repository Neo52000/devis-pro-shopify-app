import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Webhook obligatoire GDPR : suppression des données d'un client précis,
// 10 jours après une demande de suppression via Shopify.
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const email = (payload as { customer?: { email?: string } })?.customer?.email;

  if (email) {
    await db.quoteRequest.deleteMany({
      where: { shop, customerEmail: email },
    });
  }

  return new Response();
};
