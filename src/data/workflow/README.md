# Workflow Destination Souvenir — 3 Agents IA

## Structure des fichiers

```
src/data/workflow/
├── config.json          ← Configuration (affiliés, schedule, clé Unsplash)
├── queue.json           ← État du workflow (pending, en cours, validés, rejetés)
├── README.md            ← Ce fichier
├── prompts/
│   ├── agent1.md        ← Instructions Agent 1 (Ressources : GYG, Booking, Images)
│   ├── agent2.md        ← Instructions Agent 2 (Contenu + SEO)
│   └── agent3.md        ← Instructions Agent 3 (Chef / Contrôle Qualité)
└── current/
    ├── agent1-output.json   ← Résultat Agent 1 (créé pendant le run)
    └── agent2-output.json   ← Résultat Agent 2 (créé pendant le run)
```

---

## Comment lancer le workflow

### 1. Préparer les images
Ajoute les images que tu as dans `public/images/[Ville] blog/` (numérotées 1.webp, 2.webp...).
L'Agent 1 téléchargera automatiquement les images manquantes depuis Unsplash.

### 2. Lancer le workflow
Dis à Claude Code :

```
Lance le workflow pour [Ville] ([Pays], [Continent]).
L'article WP est disponible à : [chemin ou "pas disponible"]
```

Claude lancera automatiquement les 3 agents dans l'ordre.

### 3. Valider l'article
L'Agent 3 présente l'article avec un rapport. Réponds :
- **OUI** → Article validé, prêt pour git push
- **NON** + raison → Les agents reprennent avec tes corrections

### 4. Pousser en production
```bash
git add .
git commit -m "feat: article [Ville]"
git push
```

---

## Configuration 12Go

Les liens 12go (transport) sont inclus UNIQUEMENT pour :
- Cambodge
- Indonésie
- Philippines
- Thaïlande
- Vietnam

Pour tous les autres pays : 3 cartes CTA (activités, hébergement, vols).

---

## Clé Unsplash

Quand tu as ta clé API Unsplash, mets-la dans `config.json` :
```json
"images": {
  "unsplash_api_key": "ta-cle-ici",
  ...
}
```

Pour obtenir la clé : unsplash.com/oauth/applications → New Application → Access Key

---

## Planning des articles à créer

### Priorité 1 — Articles WP existants (dossier images à compléter)
- [ ] Hurghada (Égypte, Afrique)
- [ ] Split (Croatie, Europe)
- [ ] Dubrovnik (Croatie, Europe)
- [ ] Rome (Italie, Europe)
- [ ] Budapest (Hongrie, Europe)
- [ ] Las Vegas (États-Unis, Amérique)
- [ ] Miami (États-Unis, Amérique)

### Articles futurs (à définir)
À compléter au fur et à mesure.
