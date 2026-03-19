const axios = require('axios');
const db = require("quick.db")
const {
	EmbedBuilder
} = require('../../util/compat/discord.js');
const ms = require("ms")

module.exports = (client, message) => {
	client.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author,
		image: message.attachments.first() ? message.attachments.first().proxyURL : null
	})

}
