import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const quotes = await db.quoteRequest.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
    include: { lineItems: true },
    take: 50,
  });

  return { quotes };
};

const statusLabel: Record<string, string> = {
  PENDING: "En attente",
  REVIEWED: "Consulté",
  CONVERTED: "Converti",
  DECLINED: "Refusé",
};

export default function QuotesIndex() {
  const { quotes } = useLoaderData<typeof loader>();

  return (
    <s-page heading="Demandes de devis">
      <s-section heading={`${quotes.length} demande(s)`}>
        {quotes.length === 0 ? (
          <s-paragraph>
            Aucune demande de devis pour le moment. Une fois le bloc "Demander
            un devis" installé dans le thème, les demandes clients
            apparaîtront ici.
          </s-paragraph>
        ) : (
          <s-table>
            <s-table-header-row>
              <s-table-header>Client</s-table-header>
              <s-table-header>Entreprise</s-table-header>
              <s-table-header>Articles</s-table-header>
              <s-table-header>Statut</s-table-header>
              <s-table-header>Date</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {quotes.map((quote) => (
                <s-table-row key={quote.id}>
                  <s-table-cell>
                    <Link to={`/app/quotes/${quote.id}`}>
                      {quote.customerName} — {quote.customerEmail}
                    </Link>
                  </s-table-cell>
                  <s-table-cell>{quote.companyName ?? "—"}</s-table-cell>
                  <s-table-cell>{quote.lineItems.length}</s-table-cell>
                  <s-table-cell>{statusLabel[quote.status]}</s-table-cell>
                  <s-table-cell>
                    {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>
        )}
      </s-section>
    </s-page>
  );
}
