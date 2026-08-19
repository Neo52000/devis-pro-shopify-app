import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const [pending, converted, total] = await Promise.all([
    db.quoteRequest.count({ where: { shop: session.shop, status: "PENDING" } }),
    db.quoteRequest.count({ where: { shop: session.shop, status: "CONVERTED" } }),
    db.quoteRequest.count({ where: { shop: session.shop } }),
  ]);

  return { pending, converted, total };
};

export default function Index() {
  const { pending, converted, total } = useLoaderData<typeof loader>();

  return (
    <s-page heading="Devis Pro">
      <s-button slot="primary-action" href="/app/quotes">
        Voir les demandes de devis
      </s-button>

      <s-section heading="Vue d'ensemble">
        <s-stack direction="inline" gap="loose">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{total}</s-heading>
            <s-paragraph>Devis total</s-paragraph>
          </s-box>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{pending}</s-heading>
            <s-paragraph>En attente</s-paragraph>
          </s-box>
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-heading>{converted}</s-heading>
            <s-paragraph>Convertis en commande</s-paragraph>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Mise en route">
        <s-unordered-list>
          <s-list-item>
            Activez le bloc "Demander un devis" dans l'éditeur de thème
            (App embeds).
          </s-list-item>
          <s-list-item>
            Configurez le masquage des prix et le libellé du bouton dans{" "}
            <s-link href="/app/settings">Paramètres</s-link>.
          </s-list-item>
          <s-list-item>
            Traitez les demandes entrantes et convertissez-les en commande
            brouillon en un clic depuis <s-link href="/app/quotes">Devis</s-link>.
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="À propos">
        <s-paragraph>
          Devis Pro — B2B Quote &amp; Quick Order pensé pour le marché
          francophone (masquage de prix, formulaire de devis, conversion en
          commande, support en français).
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
