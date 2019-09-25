const Command = require('../handler/Command')
const fetch = require('node-fetch')
const { stringify } = require('querystring')

class LoginCommand extends Command {

    constructor() {
        super({
            name: 'login',
            description: 'Sets your nickname in this bot.',
            usage: 'login <lastfm username>',
            aliases: ['setnick']
        })
    }

    async run(client, message, args) {
        if (args.length === 0) {
            message.reply('you must provide a Last.fm username!')
            return
        }
        try {
            const params = stringify({
                method: 'user.getinfo',
                api_key: client.apikey,
                user: args.join(' '),
                format: 'json'
            })
            const data = await fetch(`${client.url}${params}`).then(r => r.json())
            if (data.user) {
                await client.models.users.create({
                    userID: message.author.id,
                    username: data.user.name
                })
                await message.reply(`Username ${data.user.name} was set to your Discord account ` +
                `succesfully!`)
            } else if (data.error === 6) {
                await message.reply('such username doesn\'t exist in Last.fm.')
                return
            }
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                await message.reply(`you already have a nickname set. Do ${client.prefix}mylogin to ` +
                `see your username, or do ${client.prefix}logout to unset your nickname.`)
            } else {
                await message.reply('something went wrong when executing a command.')
                throw e
            }
        }
    }

}

module.exports = LoginCommand