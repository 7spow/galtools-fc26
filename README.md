# GalTools FC26
<!-- deployed via Vercel -->

> L'assistant FC26 du peuple - Extension Chrome premium connectee FUT.GG

## Features

- Chat IA connecte Claude (Anthropic) avec contexte FC26 complet
- Donnees live FUT.GG + Futbin
- SBC rentables du moment
- Marche FUT - prix et tendances
- Meta actuel, formations, joueurs OP
- UI premium bleu marine / blanc

## Stack

- Frontend: HTML/CSS/JS (Extension Chrome Manifest V3)
- Backend: Vercel Serverless Functions
- IA: Claude Anthropic (claude-opus-4-5)
- Base de donnees: Supabase (historique chats, users)
- Donnees FUT: FUT.GG + Futbin

## Structure

```
galtools-fc26/
   api/
      chat.js          # Proxy Anthropic API (Vercel)
   icons/               # Icones 16/48/128px
   background.js        # Service Worker Chrome MV3
   manifest.json        # Config extension Chrome
   popup.html           # UI popup extension
   vercel.json          # Config deploiement Vercel
```

## Installation Extension Chrome

1. Clone le repo
2. Ouvre Chrome -> `chrome://extensions`
3. Active le mode developpeur
4. Clique "Charger l'extension non empaquetee"
5. Selectionne le dossier du projet

## Variables d'environnement Vercel

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

## Deploiement

```bash
npm i -g vercel
vercel --prod
```

---
Built with love par 7spow
