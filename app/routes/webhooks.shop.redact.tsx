import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Webhook obligatoire GDPR : suppression complète des données de la boutique,
// 48h après désinstallation (délai imposé par Shopify).
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  await db.quoteRequest.deleteMany({ where: { shop } });
  await db.pricingRule.deleteMany({ where: { shop } });
  await db.shopSettings.deleteMany({ where: { shop } });

  return new Response();
};
