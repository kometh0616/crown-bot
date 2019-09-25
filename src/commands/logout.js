const Command = require('../handler/Command')

class LogoutCommand extends Command {

    constructor() {
        super({
            name: 'logout',
            description: 'Unsets your nickname from the bot.',
            usage: ['logout'],
            aliases: ['delnick']
        })
    }

    async run(client, message, args) {
        const msg = await message.reply('are you sure you want to unset your nickname? ' +
        'This will also delete all of your crowns. Click on this reaction to proceed. ')
        await msg.react('✅')
        const rcFilter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id
        }
        const rcOptions = {
            max: 1, time: 30000
        }
        const reactions = await msg.awaitReactions(rcFilter, rcOptions)
        if (reactions.size > 0) {
            const { users, crowns } = client.models
            const amount = await users.destroy({
                where: {
                    userID: message.author.id
                }
            })
            if (amount > 0) {
                await crowns.destroy({
                    where: {
                        userID: message.author.id
                    }
                })
                await message.reply('your nickname was unset.')
            } else {
                await message.reply('your nickname wasn\'t found. No changes were made.')
            }
        } else {
            await message.channel.send('Reaction was not clicked. No changes were made.')
        }
    }

}

module.exports = LogoutCommand