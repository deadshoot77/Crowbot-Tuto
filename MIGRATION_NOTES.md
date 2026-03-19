# Migration notes — CrowBot

## Audit rapide

### Structure conservée
- Entrée : `index.js`
- Commandes : `commands/*` (59 fichiers)
- Events : `events/*` (42 fichiers)
- Configuration existante conservée : `config.json`
- Stockage existant conservé : `quick.db`

### Points obsolètes identifiés
- `discord.js@12.5.3`
- `discord-buttons`
- `MessageEmbed`
- `Discord.Intents.FLAGS.*`
- `fetchAllMembers`
- signatures `send/edit` avec `{ embed: ... }`
- `message.delete({ timeout })`
- événements `clickButton` / `clickMenu`
- token Discord hardcodé dans `util/login.js`

## Ce qui a été changé

### Bootstrap / runtime
- Client migré vers **discord.js v14**.
- Intents / partials migrés vers `GatewayIntentBits` et `Partials`.
- Chargement des commandes/events rendu plus robuste avec `try/catch` par fichier.
- Gestion des erreurs process améliorée (`unhandledRejection`, `uncaughtException`, `warning`).

### Sécurité
- Suppression du token hardcodé.
- Passage à `process.env.DISCORD_TOKEN`.
- Ajout de `dotenv` et d'un `.env.example`.
- Rappel explicite : l'ancien token doit être **régénéré** côté Discord Developer Portal.

### Composants / embeds
- `discord-buttons` remplacé par des composants **natifs v14** au travers d'une couche de compatibilité locale :
  - `util/compat/discord.js`
  - `util/compat/discord-components.js`
- `MessageEmbed` remplacé dans le code par `EmbedBuilder`.
- Les anciennes signatures `{ embed: ... }`, `message.edit('', { ... })` et `message.delete({ timeout })` sont normalisées par la couche de compatibilité pour éviter de casser brutalement les nombreuses commandes existantes.

### Interactions
- Passage par `interactionCreate`.
- Une passerelle réémet encore des événements `clickButton` / `clickMenu` côté code existant pour **préserver le comportement** sans réécrire d'un coup toutes les commandes interactives.
- Les reaction roles restent pris en charge et les button/select role menus reposent désormais sur les composants natifs v14.

## Remplacements importants

| Ancien | Nouveau |
|---|---|
| `discord-buttons` | composants natifs Discord.js v14 + couche de compatibilité |
| `MessageEmbed` | `EmbedBuilder` |
| `Intents.FLAGS` | `GatewayIntentBits` |
| token hardcodé | `DISCORD_TOKEN` via `.env` |
| `message.delete({ timeout })` | suppression différée moderne via wrapper |

## Limites restantes / TODO
- La compatibilité a été privilégiée pour remettre rapidement la base en état : plusieurs commandes interactives utilisent encore une **API legacy interne** traduite à l'exécution.
- Une seconde passe est recommandée pour convertir progressivement les gros assistants (`welcome`, `leave`, `embed`, `antiraid`, `giveaway`, etc.) vers des collectors et handlers d'interactions entièrement natifs, sans passerelle legacy.
- `quick.db` est conservé pour limiter l'ampleur de la migration ; à moyen terme, une migration vers une couche de persistance mieux typée/testée serait souhaitable.
- L'installation n'a pas pu être validée dans cet environnement car l'accès au registre npm renvoie actuellement des erreurs `403`.
