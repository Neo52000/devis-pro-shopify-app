import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Enregistre la commande réelle issue d'un devis une fois que le client a
// payé la commande brouillon créée depuis Devis Pro (voir la note posée dans
// app.quotes.$id.tsx, qui contient l'id du devis pour un matching fiable).
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const order = payload as { note?: string; id?: number; name?: string };

  const quoteId = order.note?.match(/Devis Pro #(\S+)/)?.[1];

  if (quoteId) {
    await db.quoteRequest.updateMany({
      where: { id: quoteId, shop },
      data: {
        orderId: order.id != null ? String(order.id) : undefined,
        orderName: order.name,
      },
    });
  }

  return new Response();
};
