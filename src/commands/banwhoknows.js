const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

class BanWhoKnowsCommand extends Command {

    constructor() {
        super({
            name: 'banwhoknows',
            description: 'Bans everyone who knows an artist',
            usage: ['banwhoknows', 'banwhoknows <artist>'],
            aliases: ['b'],
        })
    }

    async run(client, message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS', false, true, true)) {
            await message.reply(`you do not have a permission to use this command.`)
            return
        } else if (!message.guild.me.hasPermission('BAN_MEMBERS', false, true, true)) {
            await message.reply(`I do not have a permission to execute this command.`)
            return
        }
        const { users } = client.models
        const user = await users.findOne({
            where: {
                userID: message.author.id
            }
        })
        let artistName
        if (args.length === 0) {
            if (user === null) {
                await message.reply(`you are not logged in! Please login by doing \`${client.prefix}login <lastfm username>\` ` +
                `to continue, or provide a name of your artist.`)
                return
            }
            const params = stringify({
                method: 'user.getrecenttracks',
                user: user.username,
                api_key: client.apikey,
                format: 'json',
            })
            const data = await fetch(`${client.url}${params}`).then(r => r.json())
            if (data.error) {
                await message.reply('something went wrong with getting info from Last.fm.')
                console.error(data);
                return
            } else {
                const artist = data.recenttracks.track[0]
                if (artist[`@attr`] && artist[`@attr`].nowplaying) {
                    artistName = artist.artist[`#text`]
                }
            }
        } else {
            artistName = args.join(` `)
        }
        const params = stringify({
            method: 'artist.getinfo',
            artist: artistName,
            api_key: client.apikey,
            format: 'json'
        })
        const data = await fetch(`${client.url}${params}`).then(r => r.json())
        if (data.error === 6) {
            await message.reply(`no artist named ${artistName} found.`)
            return
        } else {
            const guild = await message.guild.fetchMembers()
            let banned = 0
            for (const [id, member] of guild.members) {
                const user = await users.findOne({
                    where: {
                        userID: id
                    }
                })
                if (!user) {
                    continue
                }
                const params = stringify({
                    method: 'artist.getinfo',
                    artist: artistName,
                    username: user.username,
                    api_key: client.apikey,
                    format: 'json'
                })
                const data = await fetch(`${client.url}${params}`).then(r => r.json())
                if (data.error) {
                    continue
                }
                if (data.artist.stats.userplaycount !== '0' && member.bannable) {
                    member.ban(`They listen to ${artistName}`)
                    banned++
                }
            }
            await message.reply(`Banned ${banned} people for listening to ${artistName}.`)
        }
    }

}

module.exports = BanWhoKnowsCommand