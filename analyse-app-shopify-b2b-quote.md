# Analyse de faisabilité — App Shopify "B2B Quote & Quick Order" (clone amélioré de BSS B2B Customer Portal & Quick Order)

Référence analysée : [BSS B2B Commandes & Devis](https://apps.shopify.com/b2b-customer-portal-quick-order) — catégorie Pricing Quotes / Wholesale.

---

## 1. Verdict en une ligne

**Go, mais pas en clone pur.** Le marché est large (177 apps dans la catégorie) mais dominé par 5-6 leaders génériques anglophones sans réel support français. Il existe une niche défendable : app B2B quote + quick order **francophone-native**, backée par ton expertise réelle de sync fournisseur/stock déjà construite sur ma-papeterie.fr (Liderpapel/Comlandi, Supabase↔Shopify GraphQL). Le delta d'investissement pour atteindre un MVP crédible est faible car tu réutilises des briques existantes (skill `shopify-sync`, patterns GraphQL, Edge Functions).

---

## 2. Radiographie de la référence (BSS B2B Commandes & Devis)

| Critère | Donnée |
|---|---|
| Éditeur | BSS Commerce (Hanoï, Vietnam) |
| Lancement | Juillet 2021 |
| Note | 4,9/5 sur 170 avis (94% à 5 étoiles) |
| Certification | Built for Shopify |
| Support FR | **Non natif** — app traduite en 20 langues mais support client uniquement en anglais |
| Fonctionnalités clés | Masquage prix, bouton "Demander un devis", formulaires custom, conversion devis→commande brouillon, pages Quick Order, import CSV, réachat rapide, tiered pricing, règles de quantité, multi-devise |
| Pricing | Growth 19$/mois (100 devis, 5 règles) · Business 39$/mois (illimité) · Enterprise 79$/mois (Shopify Plus, pricing régional) |
| Catégories App Store | Pricing Quotes, Wholesale |

**Lecture stratégique** : le pricing par paliers de fonctionnalité (pas par volume de commandes) est le standard du marché — c'est ce qui rend le produit scalable et prévisible pour le vendeur.

---

## 3. Paysage concurrentiel (catégorie Pricing Quotes, 177 apps)

| App | Avis | Note | Modèle |
|---|---|---|---|
| Wholesale Pricing Discount B2B | 692 | 4,9 | Freemium |
| QS Request a Quote, Hide Price | 679 | 4,8 | Freemium |
| B2B Wholesale Hub | 662 | 4,7 | Freemium |
| SA Request a Quote, Hide Price | 614 | 4,9 | Gratuit |
| BSS B2B Commandes & Devis | 170 | 4,9 | Payant dès j15 |

**Constat** : 4 apps concentrent la majorité des avis et donc de la distribution organique. Elles sont toutes anglophones par défaut, génériques (tout secteur), et jouent sur le "hide price + quote button" comme fonctionnalité socle quasi-commoditisée. Aucune ne met en avant une spécialisation métier (fournitures pro, BTP, agro, etc.) ni un support francophone réel.

**Conclusion concurrentielle** : entrer sur "hide price + quote" en frontal, en anglais, contre 4 apps à 600+ avis = perte d'argent quasi certaine (coût d'acquisition d'avis/installs trop élevé). Entrer sur un **sous-segment francophone + vertical métier** = jouable, avec un TAM plus restreint mais une concurrence quasi nulle.

---

## 4. Ton avantage compétitif réel (à exploiter, pas à ignorer)

Tu as déjà, en production sur ma-papeterie.fr :

1. Sync bidirectionnelle Supabase ↔ Shopify (GraphQL Admin API, bulk operations, webhooks HMAC) — c'est le composant technique le plus coûteux à construire (10-25k$ selon les devis marché) et tu l'as déjà.
2. Un tunnel B2B fonctionnel (leasing, devis, quantity rules) avec logique métier française déjà pensée.
3. Une connaissance opérationnelle du client B2B francophone (mairies, entreprises, collectivités) via ta prospection Chaumont — tu sais ce qu'un acheteur B2B FR attend d'un formulaire de devis (mentions légales, RIB, délais de livraison, etc.), ce que les apps anglophones ne gèrent pas nativement.

**Angle produit recommandé : "Devis Pro" — l'app B2B Quote & Quick Order pensée pour le marché francophone (France/Belgique/Suisse/Québec), avec conformité et vocabulaire commercial français natifs, support en français, et un connecteur optionnel vers ERP/fournisseurs français (positionnement que BSS ne peut pas copier facilement sans réécrire son support).**

---

## 5. Scope MVP (4-6 semaines, 1 dev à temps plein)

| # | Fonctionnalité | Priorité | Complexité |
|---|---|---|---|
| 1 | Masquer prix + bouton "Demander un devis" par produit/collection | P0 | Faible |
| 2 | Formulaire de devis personnalisable (champs custom, upload fichier) | P0 | Moyenne |
| 3 | Conversion devis → commande brouillon (draft order) | P0 | Moyenne |
| 4 | Page Quick Order (commande par référence/quantité, import CSV) | P0 | Moyenne |
| 5 | Règles de quantité et paliers tarifaires (tiered pricing) | P1 | Moyenne |
| 6 | Interface admin FR (Polaris) + emails transactionnels FR | P0 | Faible |
| 7 | Multi-devise EUR/CHF/CAD | P1 | Faible |
| 8 | Connecteur webhook générique (pour intégration ERP côté client) | P2 | Élevée |

Stack recommandée (cohérente avec ton existant) : Remix + Shopify App Bridge + Polaris, Admin GraphQL API, base de données Supabase (Postgres) pour les devis/règles, Edge Functions Deno pour la logique métier et les webhooks HMAC, déploiement Netlify ou Fly.io pour le serveur app.

---

## 6. Pricing recommandé

| Plan | Prix | Cible | Limite |
|---|---|---|---|
| Gratuit | 0€ | Acquisition, avis | 10 devis/mois, 1 page Quick Order |
| Pro | 19-24€/mois | TPE/PME B2B | Devis illimités, 5 règles |
| Business | 39-49€/mois | Grossistes, multi-catalogue | Illimité + Shopify Plus |

Aligné sur le marché (19/39/79$) avec un tarif d'entrée légèrement inférieur pour compenser l'absence de réputation au lancement.

---

## 7. Coût et délai réels pour toi

| Poste | Estimation |
|---|---|
| Développement MVP (réutilisation composants ma-papeterie.fr) | 80-120h |
| Design Polaris + traduction FR native | 15-20h |
| Soumission Shopify App Store + certification Built for Shopify | 2-4 semaines de délai (hors ton temps) |
| Coût cash (hors temps) | ~500-1500€ (hébergement, tests, assets) |

Comparé à un devis agence classique (10-25k$ pour ce niveau de fonctionnalités), ton coût réel est quasi uniquement du temps, grâce aux briques déjà écrites.

---

## 8. Plan d'action (90 jours)

| Semaine | Action |
|---|---|
| 1-2 | Spec fonctionnelle détaillée + maquettes Polaris + choix du nom/marque |
| 3-6 | Développement MVP (P0) |
| 7 | Tests sur dev store + boutique pilote (ma-papeterie.fr ou un partenaire) |
| 8 | Soumission Shopify App Store |
| 9-10 | Itération retours review Shopify + P1 |
| 11-12 | Lancement public + campagne avis (10 premiers clients ciblés via ton réseau B2B Chaumont/leasing) |

---

## 9. Risques et mitigation

| Risque | Probabilité | Mitigation |
|---|---|---|
| Rejet à la certification Shopify (sécurité, perf) | Moyenne | Suivre checklist officielle dès le design, tests de charge avant soumission |
| Cannibalisation du temps dédié à ma-papeterie.fr | Élevée | Capitaliser sur le code existant, ne pas repartir de zéro |
| Marché niche FR trop petit pour rentabiliser | Moyenne | Valider avec 3-5 prospects B2B avant développement complet (pré-vente) |
| BSS ou un concurrent ajoute un support FR | Faible à 12 mois | Vitesse d'exécution + spécialisation métier (pas juste la langue) |

---

## 10. Recommandation finale

Développer, mais **ne pas cloner** BSS fonctionnalité par fonctionnalité. Construire le MVP P0 en priorité, le tester en interne sur ma-papeterie.fr d'abord (validation gratuite), puis packager comme app payante distincte. Le facteur clé de succès n'est pas la fonctionnalité (déjà commoditisée par 20 apps similaires) mais la distribution : ton réseau B2B francophone existant est ton canal d'acquisition le plus rentable, pas l'App Store en froid.

---

Sources :
- [BSS B2B Customer Portal & Quick Order](https://apps.shopify.com/b2b-customer-portal-quick-order)
- [Catégorie Pricing Quotes — Shopify App Store](https://apps.shopify.com/categories/selling-products-pricing-pricing-quotes/all)
- [Shopify App Development Cost 2026 — Identixweb](https://www.identixweb.com/shopify-app-development-cost/)
