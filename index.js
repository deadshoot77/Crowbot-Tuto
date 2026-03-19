require('./util/loadEnv.js')();
const path = require('path');
const fs = require('fs');
const Discord = require('./util/compat/discord.js');
const keepAlive = require('./keep_alive.js');
const { login } = require('./util/login.js');

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildIntegrations,
    Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.GuildInvites,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.DirectMessageReactions,
    Discord.GatewayIntentBits.MessageContent,
  ],
  partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.GuildMember, Discord.Partials.User],
  allowedMentions: { repliedUser: false },
});

keepAlive();
login(client);

process.on('unhandledRejection', (error) => console.error('[unhandledRejection]', error));
process.on('uncaughtException', (error) => console.error('[uncaughtException]', error));
process.on('warning', (warning) => console.warn('[warning]', warning));

const loadModules = (baseDir, register) => {
  const root = path.join(__dirname, baseDir);
  if (!fs.existsSync(root)) return;
  for (const folder of fs.readdirSync(root)) {
    const folderPath = path.join(root, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    for (const file of fs.readdirSync(folderPath).filter((name) => name.endsWith('.js'))) {
      const fullPath = path.join(folderPath, file);
      try {
        delete require.cache[require.resolve(fullPath)];
        const mod = require(fullPath);
        register({ mod, file, folder, fullPath });
      } catch (error) {
        console.error(`[load:${baseDir}] ${folder}/${file}`, error);
      }
    }
  }
};

loadModules('commands', ({ mod, folder, file }) => {
  if (!mod?.name || typeof mod.run !== 'function') {
    console.warn(`[commands] Ignoré ${folder}/${file} (export invalide)`);
    return;
  }
  client.commands.set(mod.name, mod);
  if (Array.isArray(mod.aliases)) {
    for (const alias of mod.aliases) client.aliases.set(alias, mod.name);
  }
  console.log(`> Commande chargée ${mod.name} [${folder}]`);
});

loadModules('events', ({ mod, file, folder }) => {
  const eventName = path.basename(file, '.js');
  if (typeof mod !== 'function') {
    console.warn(`[events] Ignoré ${folder}/${file} (export invalide)`);
    return;
  }
  client.on(eventName, (...args) => mod(client, ...args));
  console.log(`> Event chargé ${eventName} [${folder}]`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      const legacyButton = {
        ...interaction,
        id: interaction.customId,
        clicker: { user: interaction.user, member: interaction.member, fetch: async () => interaction.member },
        reply: { defer: (ephemeral) => interaction.deferUpdate().catch(() => (ephemeral ? interaction.deferReply({ ephemeral: true }) : null)) },
      };
      client.emit('clickButton', legacyButton);
      return;
    }
    if (interaction.isStringSelectMenu()) {
      const legacyMenu = {
        ...interaction,
        id: interaction.customId,
        values: interaction.values,
        clicker: { user: interaction.user, member: interaction.member, fetch: async () => interaction.member },
        reply: { defer: (ephemeral) => interaction.deferUpdate().catch(() => (ephemeral ? interaction.deferReply({ ephemeral: true }) : null)) },
      };
      client.emit('clickMenu', legacyMenu);
    }
  } catch (error) {
    console.error('[interactionCreate]', error);
  }
});
