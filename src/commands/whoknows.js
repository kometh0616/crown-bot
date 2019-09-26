const Command = require('../handler/Command')
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const BotEmbed = require('../classes/BotEmbed')

class WhoKnowsCommand extends Command {
    
    constructor() {
        super({
            name: 'whoknows',
            description: 'Checks if anyone in a guild listens to a certain artist. ' +
            'If no artist is defined, the bot will try to look up an artist you are ' +
            'currently listening to.',
            usage: ['whoknows', 'whoknows <artist name>'],
            aliases: ['w']
        })
    }

    async run(client, message, args) {
        const { bans, users, crowns } = client.models
        const user = await users.findOne({
            where: {
                userID: message.author.id
            }
        })
        let artistName
        if (args.length === 0) {
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
                    artistName = artist[`#text`]
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
            let know = []
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
                if (data.artist.stats.userplaycount !== '0') {
                    know.push({
                        member, plays: data.artist.stats.userplaycount
                    })
                }
            }
            if (know.length === 0) {
                await message.reply(`no one listens to ${data.artist.name} here.`)
                return
            }
            know = know.sort((a, b) => parseInt(b.plays) - parseInt(a.plays))
            const sorted = know[0]
            try {
                const banned = await bans.findOne({
                    where: {
                        guildID: message.guild.id,
                        userID: sorted.member.id
                    }
                })
                if (!banned) {
                    await client.models.crowns.create({
                        guildID: message.guild.id,
                        userID: sorted.member.id,
                        artistName: data.artist.name,
                        artistPlays: sorted.plays
                    })
                }
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    const crown = await client.models.crowns.findOne({
                        where: {
                            guildID: message.guild.id,
                            artistName: data.artist.name
                        }
                    })
                    if (parseInt(crown.artistPlays) < parseInt(sorted.plays) || !guild.members.has(crown.userID)) {
                        await client.models.crowns.update({
                            userID: sorted.member.id,
                            artistPlays: sorted.plays
                        }, {
                            where: {
                                guildID: message.guild.id,
                                artistName: data.artist.name
                            }
                        })
                    }
                }
            }
            let num = 0
            const description = know
                .map(x => `${++num}. ${x.member.user.username} - **${x.plays}** plays`)
                .join('\n')
            const embed = new BotEmbed(message)
                .setTitle(`Who knows ${data.artist.name} in ${message.guild.name}?`)
                .setDescription(description)
            await message.channel.send(embed)
        }
    }

}

module.exports = WhoKnowsCommand