const Discord = require('./compat/discord.js');
const logs = require('discord-logs');
const tempo = require('./gestion/tempo.js');

const login = (client) => {
  logs(client);
  tempo(client);

  client.config = require('../config.json');
  client.cooldown = [];
  client.interaction = {};
  client.guildInvites = new Map();
  client.queue = new Map();
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  client.snipes = new Map();
  client.inter = [];

  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.warn("[auth] DISCORD_TOKEN manquant. Ajoutez-le dans votre environnement avant de lancer le bot.");
    console.warn("[auth] L'ancien token exposé dans l'historique doit être régénéré dans le Discord Developer Portal.");
    return;
  }

  client.login(token).catch((error) => {
    console.error('[auth] Connexion Discord impossible:', error.message);
  });
};

module.exports = { login };
