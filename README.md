# Devis Pro — B2B Quote & Quick Order (Shopify App)

App Shopify de devis B2B et commande rapide, positionnée sur le marché francophone
(support natif FR, vocabulaire commercial B2B français), face aux apps anglophones
dominantes du secteur (BSS B2B, Wholesale Hub, etc.).

Voir l'analyse de marché complète (concurrence, pricing, gap francophone, ROI) :
`analyse-app-shopify-b2b-quote.md` — à copier dans ce repo si besoin de référence.

## Statut

Scaffold initial — MVP P0 en place, prêt à être connecté à un compte Shopify Partner
et itéré. Non déployé, non soumis à l'App Store.

## Stack

- **Framework** : React Router 7 (successeur officiel du template Remix Shopify)
- **UI Admin** : Polaris Web Components (`s-page`, `s-section`, etc.)
- **API** : Shopify Admin GraphQL API (2025-10)
- **Base de données** : Prisma + SQLite en dev (migrer vers Postgres/Supabase en prod)
- **Storefront** : Theme App Extension (bloc Liquid "Demander un devis")
- **Communication storefront → app** : App Proxy Shopify (signé, `/apps/devis-pro/quote-request`)

## Ce qui est déjà implémenté

| Fonctionnalité | Fichier | Statut |
|---|---|---|
| Modèles de données (devis, lignes, règles de prix, paramètres boutique) | `prisma/schema.prisma` | ✅ |
| Liste des demandes de devis (admin) | `app/routes/app.quotes._index.tsx` | ✅ |
| Détail devis + conversion en commande brouillon | `app/routes/app.quotes.$id.tsx` | ✅ |
| Paramètres (masquage prix, libellé bouton, email notif) | `app/routes/app.settings.tsx` | ✅ |
| Endpoint public de réception des devis (App Proxy) | `app/routes/apps.quote-request.tsx` | ✅ |
| Bloc thème "Demander un devis" | `extensions/theme-quote-block/` | ✅ (v1, à styliser) |
| Webhooks de conformité GDPR obligatoires | `app/routes/webhooks.customers.*`, `webhooks.shop.redact.tsx` | ✅ |
| Webhook order → mise à jour statut devis | `app/routes/webhooks.orders.create.tsx` | ✅ |

## Ce qu'il reste à faire avant soumission App Store (P1/P2 du plan)

1. **Règles de quantité et paliers tarifaires** — le modèle `PricingRule` existe, l'UI admin et l'application du prix côté panier restent à coder.
2. **Page Quick Order** (commande par référence + import CSV) — non commencée.
3. **Emails transactionnels** (notification nouvelle demande, accusé de réception client) — brancher Brevo ou Resend, hook prévu dans `apps.quote-request.tsx`.
4. **Multi-devise** — non commencé.
5. **Style du bloc thème** — actuellement HTML/CSS minimal, à styliser en cohérence avec les thèmes cibles.
6. **Tests** — aucun test automatisé pour l'instant.
7. **Checklist de certification Shopify** (perf, sécurité, UX) avant soumission.

## Démarrage (à faire depuis Claude Code / ton poste, pas depuis ce sandbox)

Ce scaffold a été généré sans authentification Shopify Partner (impossible depuis un
environnement cloud sans navigateur interactif). Étapes à faire en local :

```bash
git clone https://github.com/Neo52000/devis-pro-shopify-app.git
cd devis-pro-shopify-app
npm install

# Connecte le projet à ton compte Shopify Partner (ouvre le navigateur)
npm run config:link

# Lance le serveur de dev + tunnel (installe l'app sur ta boutique de dev)
npm run dev
```

Au premier `npm run dev`, le CLI Shopify va :
- te demander de te connecter à ton compte Partner,
- créer ou lier une app dans le Dev Dashboard,
- générer `.env` avec `SHOPIFY_API_KEY`/`SHOPIFY_API_SECRET`/`SHOPIFY_APP_URL`,
- lancer les migrations Prisma et installer l'app sur ta boutique de développement.

## Variables d'environnement

Voir `.env.example`. Le `.env` réel est généré automatiquement par le CLI Shopify et
ne doit jamais être commité (déjà exclu via `.gitignore`).

## Déploiement

```bash
npm run deploy   # publie la configuration app (scopes, webhooks, extensions)
```

Hébergement du serveur (Fly.io, Render, Railway ou Netlify Functions selon préférence) à
choisir avant la mise en production — le `Dockerfile` fourni par le template est prêt à
l'emploi pour Fly.io/Render.

## Références

- [Documentation Shopify Apps](https://shopify.dev/docs/apps)
- [Guide conformité GDPR / privacy law](https://shopify.dev/docs/apps/build/privacy-law-compliance)
- [App Bridge](https://shopify.dev/docs/apps/tools/app-bridge)
- [Polaris Web Components](https://shopify.dev/docs/api/app-home/using-polaris-components)
