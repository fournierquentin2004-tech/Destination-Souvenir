# Destination Souvenir — Instructions Claude

## Stack
Astro (SSG), TypeScript, sharp pour la conversion d'images. Dossier source : `src/pages/`, assets : `public/`.

---

## Règles absolues (ne jamais enfreindre)

- **Ne jamais modifier le script parallax du hero** (`.hero-bg` onScroll dans le `<script>` de chaque article).
- **Ne jamais push sans demande explicite de l'utilisateur.**
- **Ne pas s'affilier à Booking.com** — supprimer tout paramètre `aid=` des liens Booking.
- **12go** : seul programme d'affiliation actif, via Commission Junction (`tkqlhce.com`). Tous les liens 12go doivent avoir `rel="noopener sponsored"`.

---

## Liens Booking.com

- CTA de recherche : `?ss=CITY&dest_id=XXXX&dest_type=city` uniquement.
- Lien hôtel : URL nue, sans aucun paramètre de tracking.

---

## Gestion des images

### Ajout d'une nouvelle image
Quand l'utilisateur ajoute un fichier JPG ou PNG dans `public/images/[Ville] blog/` :
1. Convertir en WebP qualité 85 avec sharp.
2. Archiver l'original dans `public/images/formatjpg/[Ville]/`.
3. Mettre à jour les références dans l'article si nécessaire.

```js
// Exemple de conversion
await sharp('public/images/[Ville] blog/N.jpg')
  .webp({ quality: 85 })
  .toFile('public/images/[Ville] blog/N.webp');
```

### Suppression d'une image
Quand un WebP est supprimé du dossier blog, supprimer aussi le fichier correspondant dans `public/images/formatjpg/[Ville]/`.

### Renommage
Utiliser `node rename-image.mjs --city "Ville" --from "ancien" --to "nouveau"` — synchronise WebP + JPG archivé + toutes les références `.astro`.

---

## Structure des articles

Chaque article `.astro` dans `src/pages/` suit ce modèle :

```
- Arrays en frontmatter : activites, hebergements, transports, conseils, faq, similaires
- Layout props : title, description, ogImage, canonicalPath, heroPage={true}, ogType="article", touristName, touristCountry
- Schemas JSON-LD (slot="head") : Article, FAQPage, BreadcrumbList
- TouristDestination : généré automatiquement par Layout via touristName + touristCountry
- <link rel="preload"> pour l'image hero
- Hero CSS background dans <style> : desktop + mobile séparés
- Sections : hero, activités (carousel), mosaïque (4 images), hébergement, budget, transport, conseils, conclusion, CTA (4 cards), FAQ, articles similaires
```

### Dimensions des images
Le script `add-img-dimensions.mjs` s'exécute en prebuild (`npm run build`) et injecte automatiquement `width` et `height` sur tous les `<img>` dont les images existent. Ne pas les ajouter manuellement si les images n'existent pas encore.

---

## SEO

- Sitemap : configuré via `@astrojs/sitemap`, sera soumis quand le vrai domaine sera actif.
- `robots.txt` : déjà en place avec `Sitemap: https://destinationsouvenir.com/sitemap-index.xml`.
- Schémas : Article + FAQPage + BreadcrumbList + TouristDestination sur tous les articles.
- Canonical path sur chaque article.

---

## Articles à créer (prochaines destinations)

### Asie (en cours)
- ✅ Bali, Bangkok, Bora Bora, Cairns, Coron, El Nido, Koh Phi Phi, Koh Samui, Maldives, Phuket, Séoul, Sydney, Tokyo
- ✅ Chiang Mai
- À faire : autres destinations Asie, puis Europe, Amériques, Afrique

### Prochaines étapes globales
1. Google Analytics (avant mise en prod)
2. Soumettre la sitemap à Google Search Console (après vrai domaine)
3. Back-office statistiques (après GA)
