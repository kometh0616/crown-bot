const Command = require('../handler/Command')

class MyLoginCommand extends Command {

    constructor() {
        super({
            name: 'mylogin',
            description: 'Tells you your set username, if you have any.',
            usage: ['mylogin'],
            aliases: ['me']
        })
    }

    async run(client, message, args) {
        const user = await client.models.users.findOne({
            where: {
                userID: message.author.id
            }
        })
        if (!user) {
            await message.reply(`you do not have a nickname set. Do so with ${client.prefix}login!`)
            return
        } else {
            await message.reply(`your Last.fm username is ${user.username}.`)
        }
    }

}

module.exports = MyLoginCommand