import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const quote = await db.quoteRequest.findFirstOrThrow({
    where: { id: params.id, shop: session.shop },
    include: { lineItems: true },
  });

  return { quote };
};

// Convertit un devis en commande brouillon Shopify (draft order),
// exactement le flux que BSS B2B propose — pré-rempli avec les lignes du devis.
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const quote = await db.quoteRequest.findFirstOrThrow({
    where: { id: params.id, shop: session.shop },
    include: { lineItems: true },
  });

  const response = await admin.graphql(
    `#graphql
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            invoiceUrl
          }
          userErrors {
            field
            message
          }
        }
      }`,
    {
      variables: {
        input: {
          email: quote.customerEmail,
          note: `Devis converti depuis Devis Pro — ${quote.companyName ?? quote.customerName}`,
          lineItems: quote.lineItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
    },
  );

  const json = await response.json();
  const draftOrder = json.data?.draftOrderCreate?.draftOrder;
  const userErrors = json.data?.draftOrderCreate?.userErrors ?? [];

  if (userErrors.length > 0 || !draftOrder) {
    return { error: userErrors.map((e: { message: string }) => e.message).join(", ") };
  }

  await db.quoteRequest.update({
    where: { id: quote.id },
    data: {
      status: "CONVERTED",
      draftOrderId: draftOrder.id,
      draftOrderUrl: draftOrder.invoiceUrl,
    },
  });

  return { draftOrderUrl: draftOrder.invoiceUrl };
};

export default function QuoteDetail() {
  const { quote } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data && "error" in fetcher.data) {
      shopify.toast.show(`Erreur : ${fetcher.data.error}`, { isError: true });
    }
    if (fetcher.data && "draftOrderUrl" in fetcher.data) {
      shopify.toast.show("Commande brouillon créée");
    }
  }, [fetcher.data, shopify]);

  const convertToOrder = () => fetcher.submit({}, { method: "POST" });

  return (
    <s-page heading={`Devis — ${quote.customerName}`}>
      <s-link slot="breadcrumb-actions" href="/app/quotes">
        Devis
      </s-link>
      <s-button
        slot="primary-action"
        onClick={convertToOrder}
        {...(isSubmitting ? { loading: true } : {})}
        {...(quote.status === "CONVERTED" ? { disabled: true } : {})}
      >
        {quote.status === "CONVERTED"
          ? "Déjà converti"
          : "Convertir en commande brouillon"}
      </s-button>

      <s-section heading="Client">
        <s-paragraph>{quote.customerName}</s-paragraph>
        <s-paragraph>{quote.customerEmail}</s-paragraph>
        {quote.customerPhone && <s-paragraph>{quote.customerPhone}</s-paragraph>}
        {quote.companyName && <s-paragraph>{quote.companyName}</s-paragraph>}
      </s-section>

      {quote.message && (
        <s-section heading="Message">
          <s-paragraph>{quote.message}</s-paragraph>
        </s-section>
      )}

      <s-section heading="Articles demandés">
        <s-table>
          <s-table-header-row>
            <s-table-header>Produit</s-table-header>
            <s-table-header>SKU</s-table-header>
            <s-table-header>Quantité</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {quote.lineItems.map((item) => (
              <s-table-row key={item.id}>
                <s-table-cell>{item.title}</s-table-cell>
                <s-table-cell>{item.sku ?? "—"}</s-table-cell>
                <s-table-cell>{item.quantity}</s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
      </s-section>

      {quote.draftOrderUrl && (
        <s-section heading="Commande brouillon" slot="aside">
          <s-link href={quote.draftOrderUrl} target="_blank">
            Ouvrir la commande brouillon
          </s-link>
        </s-section>
      )}
    </s-page>
  );
}
