// Devis Pro — logique du bloc "Demander un devis"
// Poste vers l'App Proxy /apps/devis-pro/quote-request (signé et vérifié côté serveur).
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".devis-pro-quote-block").forEach((block) => {
    const button = block.querySelector(".devis-pro-quote-button");
    const dialog = block.querySelector(".devis-pro-quote-dialog");
    const cancelBtn = block.querySelector(".devis-pro-quote-cancel");
    const form = block.querySelector(".devis-pro-quote-form");
    const status = block.querySelector(".devis-pro-quote-status");

    button?.addEventListener("click", () => dialog?.showModal());
    cancelBtn?.addEventListener("click", () => dialog?.close());

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      const payload = {
        customerName: formData.get("customerName"),
        customerEmail: formData.get("customerEmail"),
        customerPhone: formData.get("customerPhone"),
        companyName: formData.get("companyName"),
        message: formData.get("message"),
        lineItems: [
          {
            productId: block.dataset.productId,
            variantId: block.dataset.variantId,
            title: block.dataset.productTitle,
            sku: block.dataset.productSku,
            quantity: Number(formData.get("quantity") || 1),
          },
        ],
      };

      status.hidden = false;
      status.textContent = "Envoi en cours…";

      try {
        const response = await fetch("/apps/devis-pro/quote-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Échec de l'envoi");

        status.textContent = "Demande envoyée. Nous revenons vers vous rapidement.";
        form.reset();
        setTimeout(() => dialog?.close(), 1500);
      } catch (error) {
        status.textContent = "Une erreur est survenue, merci de réessayer.";
      }
    });
  });
});
