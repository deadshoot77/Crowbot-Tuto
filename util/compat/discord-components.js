const {
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonStyle,
} = require('./discord');

const styleMap = {
  blurple: ButtonStyle.Primary,
  gray: ButtonStyle.Secondary,
  green: ButtonStyle.Success,
  red: ButtonStyle.Danger,
  url: ButtonStyle.Link,
};

class MessageButton extends ButtonBuilder {
  setID(id) { return this.setCustomId(id); }
  setStyle(style) { return super.setStyle(styleMap[style] || style); }
}

class MessageMenuOption extends StringSelectMenuOptionBuilder {
  setDefault(value = true) { return super.setDefault(value); }
}

class MessageMenu extends StringSelectMenuBuilder {
  setID(id) { return this.setCustomId(id); }
  addOption(option) { return this.addOptions(option); }
}

class MessageActionRow extends ActionRowBuilder {
  addComponent(component) { return this.addComponents(component); }
}

module.exports = Object.assign(
  function noop() {},
  {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu,
    ButtonCollector: null,
  },
);
