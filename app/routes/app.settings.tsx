import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await db.shopSettings.upsert({
    where: { shop: session.shop },
    update: {},
    create: { shop: session.shop },
  });

  return { settings };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const hidePricesEnabled = formData.get("hidePricesEnabled") === "true";
  const quoteButtonLabel = String(formData.get("quoteButtonLabel") || "Demander un devis");
  const notificationEmail = String(formData.get("notificationEmail") || "");

  await db.shopSettings.upsert({
    where: { shop: session.shop },
    update: { hidePricesEnabled, quoteButtonLabel, notificationEmail },
    create: {
      shop: session.shop,
      hidePricesEnabled,
      quoteButtonLabel,
      notificationEmail,
    },
  });

  return { saved: true };
};

export default function Settings() {
  const { settings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  useEffect(() => {
    if (fetcher.data?.saved) {
      shopify.toast.show("Paramètres enregistrés");
    }
  }, [fetcher.data, shopify]);

  const save = (formData: FormData) => fetcher.submit(formData, { method: "POST" });

  return (
    <s-page heading="Paramètres">
      <s-section heading="Comportement des prix">
        <s-form
          onSubmit={(event: SubmitEvent) => {
            event.preventDefault();
            save(new FormData(event.target as HTMLFormElement));
          }}
        >
          <s-stack direction="block" gap="base">
            <s-checkbox
              name="hidePricesEnabled"
              label="Masquer les prix pour les visiteurs non connectés"
              value="true"
              defaultChecked={settings.hidePricesEnabled}
            />
            <s-text-field
              name="quoteButtonLabel"
              label="Libellé du bouton de devis"
              defaultValue={settings.quoteButtonLabel}
            />
            <s-text-field
              name="notificationEmail"
              label="Email de notification des nouvelles demandes"
              type="email"
              defaultValue={settings.notificationEmail ?? ""}
            />
            <s-button type="submit" variant="primary">
              Enregistrer
            </s-button>
          </s-stack>
        </s-form>
      </s-section>

      <s-section slot="aside" heading="Étapes suivantes">
        <s-paragraph>
          Installez le bloc "Demander un devis" dans le thème (App embed) pour
          activer le formulaire côté boutique.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}
