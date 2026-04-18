# Déploiement GitHub Pages

Ce projet est développé sur Lovable (TanStack Start) mais peut être déployé en tant que **SPA statique** sur GitHub Pages.

## Configuration une fois

1. Pousse ton code sur GitHub (via la connexion Lovable → GitHub).
2. Dans le repo GitHub : **Settings → Pages → Source = GitHub Actions**.
3. C'est tout. À chaque push sur `main`, le workflow `.github/workflows/deploy.yml` :
   - build le projet,
   - injecte le base path `/<nom-du-repo>/` automatiquement,
   - copie `index.html` en `404.html` (fallback SPA pour le routing client),
   - publie sur GitHub Pages.

## URL finale
`https://<ton-user>.github.io/<nom-du-repo>/`

## Test local du build SPA
```bash
VITE_BASE_PATH=/ bun run build:spa
npx serve dist
```

## Notes
- La preview Lovable continue d'utiliser TanStack Start (SSR) normalement.
- Le fichier `src/spa-entry.tsx` est uniquement utilisé par le build statique.
- Si tu déploies à la racine d'un domaine custom, mets `VITE_BASE_PATH=/` dans le workflow.
