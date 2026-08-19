import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

// Webhook obligatoire pour la conformité GDPR/App Store :
// le client demande l'accès aux données que l'app détient sur lui.
// Devis Pro ne stocke que les devis (nom, email, téléphone, entreprise, lignes produits) —
// à adapter si de nouvelles données personnelles sont ajoutées au schéma.
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  // TODO: exporter et transmettre au marchand les QuoteRequest liées à
  // customer.email dans le payload, selon le processus documenté ici :
  // https://shopify.dev/docs/apps/build/privacy-law-compliance

  return new Response();
};
