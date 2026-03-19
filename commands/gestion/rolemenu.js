const Discord = require('../../util/compat/discord.js')
const db = require('quick.db')
const {
    MessageActionRow,
    MessageButton,
    MessageMenuOption,
    MessageMenu,
    ButtonCollector
} = require('../../util/compat/discord-components.js');

function bttcolor(color) {
    if (color === null || !color || color === undefined) return `Bleu`
    if (color === "blurple") return `Bleu`
    if (color === "red") return `Rouge`
    if (color === "green") return `Vert`
    if (color === "gray") return `Gris`

}
module.exports = {
    name: 'rolemenu',
    aliases: [],
    run: async (client, message, args, prefix, color) => {

        function updateembed(msg) {

            if (db.get(`rolemenustyle_${message.guild.id}`) === "Réactions" || db.get(`rolemenustyle_${message.guild.id}`) === null) {
                let embed = new Discord.EmbedBuilder()
                embed.setTitle(`Configuration Rolemenu`)
                embed.setColor(color)
                embed.setTimestamp()
                embed.setFooter(`${client.config.name}`)
                embed.addField("Message", db.get(`rolemenumsg_${msg.guild.id}`) === null ? `Le dernier du salon (${message.channel})` : `[${db.get(`rolemenumsg_${message.guild.id}`)}](https://discord.com/channels/${message.guild.id}/${db.get(`rolemenusalon_${message.guild.id}`)}/${db.get(`rolemenumsg_${message.guild.id}`)}) (<#${db.get(`rolemenusalon_${message.guild.id}`)}>)`)
                embed.addField("Style", db.get(`rolemenustyle_${message.guild.id}`) === null ? "Réaction" : `${db.get(`rolemenustyle_${message.guild.id}`)}`)
                embed.addField("Rôle", db.get(`rolemenurole_${msg.guild.id}`) === null ? "❌" : `<@&${db.get(`rolemenurole_${msg.guild.id}`)}> (${db.get(`rolemenurole_${msg.guild.id}`)})`)
                embed.addField("Réaction", db.get(`rolemenuemoji_${msg.guild.id}`) === null ? "❌" : `${db.get(`rolemenuemoji_${msg.guild.id}`)}`)

                let menuoptions = [{
                        value: "Style Boutons",
                        description: "Permet de chosir bouton pour le rolemenu",
                        emoji: "📑"
                    },
                    {
                        value: "Modifier le message",
                        description: "Permet de choisir le message",
                        emoji: "📝"
                    },
                    {
                        value: "Modifier le rôle",
                        description: "Permet de choisir le rôle",
                        emoji: "👤"
                    },
                    {
                        value: "Modifier la réaction",
                        description: "Permet de choisir la réaction",
                        emoji: "⭐"
                    },
                ]

                let interactiveButtons = new MessageMenu()
                    .setID(message.id + 'MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Faix un choix');
                menuoptions.forEach(option => {
                    let row = new MessageMenuOption()
                        .setLabel(option.label ? option.label : option.value)
                        .setValue(option.value)
                        .setDescription(option.description)
                        .setDefault()
                    if (option.emoji) row.setEmoji(option.emoji)
                    interactiveButtons.addOption(row)
                })
                const bt = new MessageButton()
                    .setStyle("gray")
                    .setID("rolemenuvalider" + message.id)
                    .setEmoji("✅")
                    .setLabel("Valider")
                const bt2 = new MessageButton()
                    .setStyle("gray")
                    .setID("rolemenuannuler" + message.id)
                    .setEmoji("❌")
                    .setLabel("Re formuler votre choix")
                msg.edit("", {
                    embed: embed,
                    components: [

                        {
                            type: 1,
                            components: [interactiveButtons]
                        },

                        {
                            type: 1,
                            components: [bt, bt2],
                        }
                    ]
                })

            } else if (db.get(`rolemenustyle_${message.guild.id}`) === "Boutons" || db.get(`rolemenustyle_${message.guild.id}`) === null) {
                let embed = new Discord.EmbedBuilder()
                embed.setTitle(`Configuration Rolemenu`)
                embed.setColor(color)
                embed.setTimestamp()
                embed.setFooter(`${client.config.name}`)
                embed.addField("Message", db.get(`rolemenumsg_${msg.guild.id}`) === null ? `Le dernier du salon (${message.channel})` : `[${db.get(`rolemenumsg_${message.guild.id}`)}](https://discord.com/channels/${message.guild.id}/${db.get(`rolemenusalon_${message.guild.id}`)}/${db.get(`rolemenumsg_${message.guild.id}`)}) (<#${db.get(`rolemenusalon_${message.guild.id}`)}>)`)
                embed.addField("Style", db.get(`rolemenustyle_${message.guild.id}`) === null ? "Réaction" : `${db.get(`rolemenustyle_${message.guild.id}`)}`)
                embed.addField("Rôle", db.get(`rolemenurole_${msg.guild.id}`) === null ? "❌" : `<@&${db.get(`rolemenurole_${msg.guild.id}`)}> (${db.get(`rolemenurole_${msg.guild.id}`)})`)
                embed.addField("Couleur", db.get(`rolemenucolor_${msg.guild.id}`) === null ? bttcolor("blurple") : `${bttcolor(db.get(`rolemenucolor_${msg.guild.id}`))}`)
                embed.addField("Text", db.get(`rolemenutext_${msg.guild.id}`) === null ? "❌" : `${db.get(`rolemenutext_${msg.guild.id}`)}`)
                embed.addField("Emoji", db.get(`rolemenubuttonemoji_${msg.guild.id}`) === null ? "❌" : `${db.get(`rolemenubuttonemoji_${msg.guild.id}`)}`)

                let menuoptions = [{
                        value: "Style Réactions",
                        description: "Permet de chosir réaction pour le rolemenu",
                        emoji: "📑"
                    },
                    {
                        value: "Modifier le message",
                        description: "Permet de choisir le message",
                        emoji: "📝"
                    },
                    {
                        value: "Modifier le rôle",
                        description: "Permet de choisir le rôle",
                        emoji: "👤"
                    },
                    {
                        value: "Modifier la couleur",
                        description: "Permet de choisir la couleur",
                        emoji: "🎨"
                    },
                    {
                        value: "Modifier le text",
                        description: "Permet de choisir le texte",
                        emoji: "📄"
                    },
                    {
                        value: "Supprimer le text",
                        description: "Permet de supprimer le text",
                        emoji: "📜"
                    },
                    {
                        value: "Modifier l'emoji",
                        description: "Permet de chosir l'émoji",
                        emoji: "🌟"
                    },
                    {
                        value: "Supprimer l'emoji",
                        description: "Permet de supprimer l'émoji",
                        emoji: "⭐"
                    },
                ]

                let interactiveButtons = new MessageMenu()
                    .setID(message.id + 'MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Faix un choix');
                menuoptions.forEach(option => {
                    let row = new MessageMenuOption()
                        .setLabel(option.label ? option.label : option.value)
                        .setValue(option.value)
                        .setDescription(option.description)
                        .setDefault()
                    if (option.emoji) row.setEmoji(option.emoji)
                    interactiveButtons.addOption(row)
                })
                const bt = new MessageButton()
                    .setStyle("gray")
                    .setID("rolemenuvalider" + message.id)
                    .setEmoji("✅")
                    .setLabel("Valider")
                const bt2 = new MessageButton()
                    .setStyle("gray")
                    .setID("rolemenuannuler" + message.id)
                    .setEmoji("❌")
                    .setLabel("Re formuler votre choix")
                msg.edit("", {
                    embed: embed,
                    components: [

                        {
                            type: 1,
                            components: [interactiveButtons]
                        },

                        {
                            type: 1,
                            components: [bt, bt2],
                        }
                    ]
                })
            }


        }

        let perm = ""
        message.member.roles.cache.forEach(role => {
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
        })
        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {

            message.channel.send(`Rolemenu • ${client.config.name}`).then(async m => {
                setTimeout(() => {
                    m.edit({
                        components: []
                    })
                    // message.channel.send(embeds)
                }, 60000 * 5)
                updateembed(m)
                client.on('clickMenu', async (menu) => {
                    if (message.author !== menu.clicker.user || menu.message.id !== m.id) return;
                    menu.reply.defer(true)
                    menuselection(menu)
                })
                client.on('clickButton', async (button) => {


                    if (message.author !== button.clicker.user) return;
                    button.reply.defer(true)
                    if (button.id === "rolemenuvalider" + message.id) {

                        if (db.get(`rolemenustyle_${message.guild.id}`) === "Réactions" || db.get(`rolemenustyle_${message.guild.id}`) === null) {

                            let channel = message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) || message.channel
                            channel.messages.fetch(db.get(`rolemenumsg_${message.guild.id}`)).then(async mmm => {
                                if (!mmm) return mmm == channel.lastMessage
                                if (!mmm) return message.channel.send(`Aucun **message** valide n'est configuré !`)

                                let role = message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))

                                if (!channel) return message.channel.send(`Aucun **salon** valide n'est configuré !`)

                                if (!role) return message.channel.send(`Aucun **rôle** valide n'est configuré !`)
                                mmm.react(db.get(`rolemenuemoji_${message.guild.id}`)).then(() => {
                                    db.push(`reactions_${message.guild.id}`, {
                                        msg: mmm.id,
                                        channel: channel.id,
                                        emoji: db.get(`rolemenuemoji_${message.guild.id}`),
                                        roleId: role.id
                                    });
                                    return message.channel.send(`Rolemenu crée`)
                                }).catch(() => {
                                    return message.channel.send(`Aucune **réaction** valide n'est configuré !`)

                                })


                            }).catch(() => {
                                return message.channel.send(`Aucun **message** valide n'est configuré !`)

                            })
                        } else if (db.get(`rolemenustyle_${message.guild.id}`) === "Boutons") {


                            let channel = message.guild.channels.cache.get(db.get(`rolemenusalon_${message.guild.id}`)) || message.channel
                            if (!channel) return message.channel.send(`Aucun **salon** valide n'est configuré !`)

                            channel.messages.fetch(db.get(`rolemenumsg_${message.guild.id}`)).then(async mmm => {
                                let role = message.guild.roles.cache.get(db.get(`rolemenurole_${message.guild.id}`))

                                if (!role) return message.channel.send(`Aucun **rôle** valide n'est configuré !`)
                                let yes = false
                                if (db.get(`rolemenutext_${message.guild.id}`) === null && db.get(`rolemenubuttonemoji_${message.guild.id}`) !== null) yes = true
                                if (db.get(`rolemenutext_${message.guild.id}`) !== null && db.get(`rolemenubuttonemoji_${message.guild.id}`) === null) yes = true
                                if (db.get(`rolemenutext_${message.guild.id}`) !== null && db.get(`rolemenubuttonemoji_${message.guild.id}`) !== null) yes = true
                                if (!yes) return message.channel.send(`Pas asser de données`)

                                let buttonmenu = new MessageButton()
                                buttonmenu.setID("menu-" + role.id)
                                if (db.get(`rolemenubuttonemoji_${message.guild.id}`) !== null) buttonmenu.setEmoji(db.get(`2rolemenubuttonemoji_${message.guild.id}`) === null ? db.get(`rolemenubuttonemoji_${message.guild.id}`) : db.get(`2rolemenubuttonemoji_${message.guild.id}`))
                                if (db.get(`rolemenutext_${message.guild.id}`) !== null) buttonmenu.setLabel(db.get(`rolemenutext_${message.guild.id}`) || role.name)
                                buttonmenu.setStyle(db.get(`rolemenucolor_${message.guild.id}`) || "blurple")


                                mmm.edit({
                                    button: [buttonmenu],
                                    embed: new Discord.EmbedBuilder(mmm.embeds[0])
                                }).catch(() => {
                                    return message.channel.send(`Ce message n'est pas de moi, je ne peux pas créer de menu de ce style dessus`)

                                }).then(() => {

                                    message.channel.send(`Rolemenu crée`)
                                    return db.set(`buttonmenuconfig_${message.guild.id}`,
                                        role.id,


                                    )
                                })

                            })
                        }
                    }
                    if (button.id === "rolemenuannuler" + message.id) {

                        updateembed(m)
                    }
                })

                function menuselection(menu) {
                    switch (menu.values[0]) {
                        case "Style Réactions":
                            db.set(`rolemenustyle_${message.guild.id}`, "Réactions")
                            updateembed(m)
                            break
                        case "Style Boutons":
                            db.set(`rolemenustyle_${message.guild.id}`, "Boutons")
                            updateembed(m)
                            break
                        case "Supprimer le text":
                            db.delete(`rolemenutext_${message.guild.id}`)
                            updateembed(m)
                            break
                        case "Modifier le text":
                            message.channel.send(`Quel est **le nouveau text du bouton ?**`).then(mp => {
                                mp.channel.awaitMessages(response => {
                                        return response.author.id === message.author.id
                                    }, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })
                                    .then(cld => {

                                        var msg = cld.first();

                                        db.set(`rolemenutext_${message.guild.id}`, msg.content)

                                        mp.delete()
                                        cld.first().delete()
                                        updateembed(m)



                                    });
                            })
                            break
                        case "Supprimer l'emoji":
                            db.delete(`rolemenubuttonemoji_${message.guild.id}`)
                            updateembed(m)
                            break
                        case "Modifier l'emoji":
                            message.channel.send(`Quel est **le nouveau emoji du bouton ?**`).then(mp => {
                                mp.channel.awaitMessages(response => {
                                        return response.author.id === message.author.id
                                    }, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })
                                    .then(cld => {

                                        var msg = cld.first();
                                        cld.first().react(msg.content).then(() => {
                                            db.set(`rolemenubuttonemoji_${message.guild.id}`, msg.content)
                                            db.delete(`2rolemenubuttonemoji_${message.guild.id}`)
                                            if (Discord.Util.parseEmoji(msg.content).id) db.set(`2rolemenubuttonemoji_${message.guild.id}`, Discord.Util.parseEmoji(msg.content).id)
                                            mp.delete()
                                            cld.first().delete()
                                            updateembed(m)
                                        }).catch(() => {
                                            mp.delete()
                                            cld.first().delete()
                                            return message.channel.send(`Je n'est pas accès à cette emoji`)

                                        })




                                    });
                            })
                            break
                        case "Modifier la couleur":
                            message.channel.send(`Quel est **la nouvelle couleur du bouton ?** (\`bleu\`, \`gris\`, \`rouge\`, \`vert\`)`).then(mp => {
                                mp.channel.awaitMessages(response => {
                                        return response.author.id === message.author.id
                                    }, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })
                                    .then(cld => {
                                        const msgc = cld.first().content
                                        const msg = cld.first()
                                        if (msgc.toLowerCase() === "bleu" || msgc.toLowerCase() === "blurple") {
                                            db.set(`rolemenucolor_${message.guild.id}`, "blurple")
                                            msg.delete()
                                            mp.delete()
                                            updateembed(m)
                                        } else if (msgc.toLowerCase() === "gris" || msgc.toLowerCase() === "gray") {
                                            db.set(`rolemenucolor_${message.guild.id}`, "gray")
                                            msg.delete()
                                            mp.delete()
                                            updateembed(m)
                                        } else if (msgc.toLowerCase() === "rouge" || msgc.toLowerCase() === "red") {
                                            db.set(`rolemenucolor_${message.guild.id}`, "red")
                                            msg.delete()
                                            mp.delete()
                                            updateembed(m)
                                        } else if (msgc.toLowerCase() === "vert" || msgc.toLowerCase() === "green") {
                                            db.set(`rolemenucolor_${message.guild.id}`, "green")
                                            msg.delete()
                                            mp.delete()
                                            updateembed(m)
                                        } else {
                                            return message.channel.send(`Couleur incorect.`)
                                        }




                                    });
                            })
                            break
                        case "Modifier le message":
                            message.channel.send(`Quel est **le salon où ce trouve le message** ?`).then(mp => {
                                mp.channel.awaitMessages(response => {
                                        return response.author.id === message.author.id
                                    }, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })
                                    .then(cld => {

                                        var msg = cld.first();
                                        var role = message.guild.channels.cache.get(msg.content) || msg.mentions.channels.first()
                                        if (!role) return message.channel.send(`Aucun salon trouvé pour \`${msg.content}\`.`);

                                        message.channel.send(`Quel est **l'id du message** ?`).then(mpe => {
                                            mpe.channel.awaitMessages(response => {
                                                    return response.author.id === message.author.id
                                                }, {
                                                    max: 1,
                                                    time: 60000,
                                                    errors: ['time']
                                                })
                                                .then(cld2 => {

                                                    var msge = cld2.first();
                                                    var rolee = role.messages.fetch(msge.content);

                                                    if (!rolee) return message.channel.send(`Aucun message trouvé pour \`${msge.content}\`.`);
                                                    db.set(`rolemenumsg_${message.guild.id}`, msge.content)
                                                    db.set(`rolemenusalon_${message.guild.id}`, role.id)

                                                    mp.delete()
                                                    cld.first().delete()
                                                    mpe.delete()
                                                    cld2.first().delete()
                                                    updateembed(m)

                                                });
                                        })


                                    });
                            })
                            break
                        case "Modifier le rôle":
                            message.channel.send(`Quel est **le rôle a donner** ?`).then(mp => {
                                mp.channel.awaitMessages(response => {
                                        return response.author.id === message.author.id
                                    }, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })
                                    .then(cld => {

                                        var msg = cld.first();
                                        var role = message.guild.roles.cache.get(msg.content) || msg.mentions.roles.first()
                                        if (!role) return message.channel.send(`Aucun rôle trouvé pour \`${msg.content}\``);
                                        db.set(`rolemenurole_${message.guild.id}`, role.id)

                                        mp.delete()
                                        cld.first().delete()
                                        updateembed(m)



                                    });
                            })
                            break
                        case "Modifier la réaction":
                            message.channel.send(`Quel est **la réaction** ?`).then(mp => {
                                mp.channel.awaitMessages(response => {
                                        return response.author.id === message.author.id
                                    }, {
                                        max: 1,
                                        time: 60000,
                                        errors: ['time']
                                    })
                                    .then(cld => {

                                        var msg = cld.first();

                                        cld.first().react(msg.content).then(() => {
                                            db.set(`rolemenuemoji_${message.guild.id}`, msg.content)
                                            mp.delete()
                                            cld.first().delete()
                                            updateembed(m)
                                        }).catch(() => {
                                            mp.delete()
                                            cld.first().delete()
                                            return message.channel.send(`Je n'est pas accès à cette emoji`)

                                        })




                                    });
                            })
                            break

                    }
                }
            })

        }

    }
}
