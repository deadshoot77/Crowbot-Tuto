# CrowBot Tuto — migration discord.js v14

Cette base conserve l'esprit CrowBot : projet **JavaScript CommonJS**, **handler préfixé** (`+` par défaut), commandes FR, structure `commands/*` et `events/*`, stockage `quick.db`, et menus/boutons migrés vers les **composants natifs de Discord.js v14**.

## Prérequis

- **Node.js 20 LTS** ou plus récent.
- Un bot Discord avec les intents activés dans le **Discord Developer Portal** :
  - Server Members Intent
  - Presence Intent
  - Message Content Intent

## Installation

```bash
npm install
cp .env.example .env
# éditez .env puis ajoutez votre token
npm start
```

## Configuration

### 1) Variables d'environnement

Le token n'est plus stocké dans le code.

```env
DISCORD_TOKEN=...
PORT=8080
```

> Si l'ancien token du dépôt a été exposé, **régénérez-le immédiatement** dans le Discord Developer Portal avant toute mise en production.

### 2) `config.json`

Le fichier `config.json` reste utilisé pour la couleur, le préfixe, le nom d'affichage et les IDs owner.

## Ce qui a été modernisé

- Migration de **discord.js 12 → 14**.
- Remplacement de **discord-buttons** par les **composants natifs** (`ButtonBuilder`, `ActionRowBuilder`, `StringSelectMenuBuilder`) via une couche de compatibilité pour limiter la réécriture.
- Token déplacé vers `process.env.DISCORD_TOKEN` avec `dotenv`.
- Bootstrap revu : intents/partials v14, chargement résilient des commandes/events, logs de démarrage et gestion d'erreurs améliorée.
- `keep_alive.js` converti en module réutilisable, cohérent pour Render.

## Démarrage Render

- Build command : `npm install`
- Start command : `npm start`
- Environment :
  - `DISCORD_TOKEN`
  - `PORT`
  - `NODE_VERSION=20`

## Notes

- Le bot **garde les commandes préfixées**.
- Plusieurs assistants interactifs historiques reposaient sur `discord-buttons` : ils passent maintenant par `interactionCreate` avec une **passerelle de compatibilité** pour préserver au maximum le comportement existant.
- Consultez `MIGRATION_NOTES.md` pour les détails des remplacements, limites connues et points à surveiller.
