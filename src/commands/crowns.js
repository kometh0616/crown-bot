const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const fs = require('fs')
const path = require('path')

class CrownsCommand extends Command {

    constructor() {
        super({
            name: 'crowns',
            description: 'Shows you your crowns, crowns in this server, ' +
            'bans/unbans people from having crowns and resets people\'s crowns.',
            usage: [
                'crowns', 
                'crowns ban <user>', 
                'crowns unban <user>', 
                'crowns reset <user>',
                'crowns guild',
                'crowns <user>'
            ],
            aliases: ['cw']
        })
    }

    async run(client, message, args) {
        const files = fs.readdirSync(path.join(__dirname, 'crowns'))
        const cmds = files.map(x => x.slice(0, x.length - 3))
        let user
        if (args.length > 0) {
            if (cmds.includes(args[0])) {
                const command = require(`./crowns/${args[0]}`)
                await command.run(client, message, args.slice(1))
                return
            } else {
                user = message.mentions.members.first()
            }
        } else {
            user = message.member
        }
        const crowns = await client.models.crowns.findAll({
            where: {
                guildID: message.guild.id,
                userID: user.id
            }
        })
        if (crowns.length > 0) {
            let num = 0
            const description = crowns
                .sort((a, b) => parseInt(b.artistPlays) - parseInt(a.artistPlays))
                .slice(0, 10)
                .map(x => `${++num}. ${x.artistName} - **${x.artistPlays}** plays`)
                .join('\n')
                + `\n\n${user.user.username} has **${crowns.length}** crowns in ${message.guild.name}.`
            const embed = new BotEmbed(message)
                .setTitle(`Crowns of ${user.user.tag} in ${message.guild.name}`)
                .setDescription(description)
                .setThumbnail(user.user.avatarURL)
            await message.channel.send(embed)
            
        } else {
            await message.reply(`${user.user.username} does not have any crowns in this server.`)
        }
    }

}

module.exports = CrownsCommand