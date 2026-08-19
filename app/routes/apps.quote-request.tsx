import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// Endpoint appelé par le formulaire "Demander un devis" côté boutique,
// via App Proxy Shopify (URL publique signée : /apps/devis-pro/quote-request).
// Voir extensions/theme-quote-block pour le bloc de thème qui poste ici.
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  const {
    customerName,
    customerEmail,
    customerPhone,
    companyName,
    message,
    lineItems,
  } = body as {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    companyName?: string;
    message?: string;
    lineItems: Array<{
      productId: string;
      variantId: string;
      title: string;
      sku?: string;
      quantity: number;
    }>;
  };

  if (!customerEmail || !lineItems?.length) {
    return Response.json(
      { error: "customerEmail et lineItems sont requis" },
      { status: 400 },
    );
  }

  const quote = await db.quoteRequest.create({
    data: {
      shop: session.shop,
      customerName: customerName ?? "",
      customerEmail,
      customerPhone,
      companyName,
      message,
      lineItems: {
        create: lineItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          title: item.title,
          sku: item.sku,
          quantity: item.quantity,
        })),
      },
    },
  });

  // TODO: envoyer un email de notification (Resend/SendGrid/Brevo) à
  // ShopSettings.notificationEmail à chaque nouvelle demande.

  return Response.json({ ok: true, quoteId: quote.id });
};
