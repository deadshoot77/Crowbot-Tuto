const Discord = require('discord.js');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ChannelType,
  PermissionFlagsBits,
  ButtonStyle,
  EmbedBuilder: NativeEmbedBuilder,
  Events,
  PermissionsBitField,
} = Discord;

class CompatEmbedBuilder extends NativeEmbedBuilder {
  setFooter(footer, iconURL) {
    if (typeof footer === 'string') return super.setFooter({ text: footer, iconURL });
    return super.setFooter(footer || {});
  }
  addField(name, value, inline = false) {
    return super.addFields({ name: String(name), value: String(value), inline });
  }
  attachFiles() { return this; }
}

const normalizePayload = (payload, extra) => {
  if (extra && typeof extra === 'object') {
    payload = { content: typeof payload === 'string' ? payload : undefined, ...extra };
  }
  if (payload instanceof CompatEmbedBuilder || payload instanceof NativeEmbedBuilder) return { embeds: [payload] };
  if (typeof payload === 'string') return { content: payload };
  if (!payload || typeof payload !== 'object') return payload;
  const next = { ...payload };
  if (next.embed) {
    next.embeds = [next.embed];
    delete next.embed;
  }
  if (next.embeds && !Array.isArray(next.embeds)) next.embeds = [next.embeds];
  return next;
};

const patchMethod = (prototype, methodName) => {
  const original = prototype?.[methodName];
  if (!original || original.__crowbotPatched) return;
  prototype[methodName] = function patched(payload, extra) {
    if (methodName === 'delete' && payload && typeof payload === 'object' && 'timeout' in payload) {
      const delay = Number(payload.timeout) || 0;
      return new Promise((resolve) => {
        setTimeout(() => resolve(original.call(this).catch(() => null)), delay);
      });
    }
    return original.call(this, normalizePayload(payload, extra));
  };
  prototype[methodName].__crowbotPatched = true;
};

patchMethod(Discord.TextBasedChannel?.prototype, 'send');
patchMethod(Discord.Message?.prototype, 'edit');
patchMethod(Discord.Message?.prototype, 'reply');
patchMethod(Discord.Message?.prototype, 'delete');

for (const proto of [Discord.CommandInteraction?.prototype, Discord.ButtonInteraction?.prototype, Discord.StringSelectMenuInteraction?.prototype, Discord.ModalSubmitInteraction?.prototype]) {
  patchMethod(proto, 'reply');
  patchMethod(proto, 'editReply');
  patchMethod(proto, 'followUp');
  patchMethod(proto, 'update');
}

const oldPermMap = new Proxy({}, { get: (_, key) => PermissionFlagsBits[key] || PermissionFlagsBits[String(key).replace(/ /g, '')] });
const hasPerm = function(permission, checkAdmin = true) {
  const perms = Array.isArray(permission) ? permission : [permission];
  return this.permissions.has(perms.map((perm) => oldPermMap[perm] || perm), checkAdmin);
};
if (Discord.GuildMember && !Discord.GuildMember.prototype.hasPermission) Discord.GuildMember.prototype.hasPermission = hasPerm;
if (Discord.Role && !Discord.Role.prototype.hasPermission) Discord.Role.prototype.hasPermission = hasPerm;
if (Discord.BaseGuildTextChannel && !Discord.BaseGuildTextChannel.prototype.hasPermission) Discord.BaseGuildTextChannel.prototype.hasPermission = hasPerm;
if (Discord.Guild && !Object.getOwnPropertyDescriptor(Discord.Guild.prototype, 'me')) {
  Object.defineProperty(Discord.Guild.prototype, 'me', { get() { return this.members.me; } });
}

module.exports = {
  ...Discord,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ChannelType,
  PermissionFlagsBits,
  Permissions: PermissionsBitField,
  ButtonStyle,
  EmbedBuilder: CompatEmbedBuilder,
  Events,
  normalizePayload,
};
