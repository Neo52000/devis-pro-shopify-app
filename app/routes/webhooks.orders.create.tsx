import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Marque le devis correspondant comme "converti" quand la commande brouillon
// issue du devis est réellement payée par le client.
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const order = payload as { note?: string; id?: number };

  if (order.note?.includes("Devis converti depuis Devis Pro")) {
    await db.quoteRequest.updateMany({
      where: { shop, status: "CONVERTED", draftOrderUrl: { not: null } },
      data: { status: "CONVERTED" },
    });
  }

  return new Response();
};
