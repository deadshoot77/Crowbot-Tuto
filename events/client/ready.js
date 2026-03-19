const Discord = require('../../util/compat/discord.js');
const disbut = require('../../util/compat/discord-components.js')
const db = require("quick.db")

module.exports = (client) => {
	console.log(`- Connecter ${client.user.username}`)
	client.guilds.cache.map(async guild => {
		await guild.members.fetch().catch(e => {})
	})
}
