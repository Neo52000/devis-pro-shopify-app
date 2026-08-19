import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Webhook obligatoire pour la conformité GDPR/App Store :
// le client demande l'accès aux données que l'app détient sur lui.
// Devis Pro ne stocke que les devis (nom, email, téléphone, entreprise, lignes produits) —
// à adapter si de nouvelles données personnelles sont ajoutées au schéma.
//
// Conformément à https://shopify.dev/docs/apps/build/privacy-law-compliance,
// l'obligation de l'app est de mettre ces données à disposition du marchand
// (qui reste responsable de la transmission au client dans les 30 jours).
// Aucun service d'email n'étant encore branché, l'export est journalisé de
// façon structurée pour que le marchand puisse le retrouver dans les logs
// d'hébergement — à remplacer par un envoi automatique (Brevo/Resend) une
// fois ce service configuré.
export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  const customerEmail = (payload as { customer?: { email?: string } })
    ?.customer?.email;

  if (customerEmail) {
    const quotes = await db.quoteRequest.findMany({
      where: { shop, customerEmail },
      include: { lineItems: true },
    });

    console.log(
      `[GDPR data_request] shop=${shop} customerEmail=${customerEmail} export=`,
      JSON.stringify(quotes),
    );
  }

  return new Response();
};
