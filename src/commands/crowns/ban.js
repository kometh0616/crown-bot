exports.run = async (client, message, args) => {
    if (message.member.hasPermission('BAN_MEMBERS', false, true, true)) {
        const user = message.mentions.users.first()
        if (user) {
            try {
                console.log(message.guild.id, user.id)
                const { bans, crowns } = client.models
                const amount = await crowns.destroy({
                    where: {
                        guildID: message.guild.id,
                        userID: user.id
                    }
                })
                console.log(amount)
                await bans.create({
                    guildID: message.guild.id,
                    userID: user.id
                })
                await message.reply(`banned ${user.tag} from getting crowns in ${message.guild.name}.`)
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    await message.reply(`${user.tag} is already banned here. No changes were made.`)
                }
            }
        } else {
            await message.reply('you must mention a user you want to ban.')
        }
    } else {
        await message.reply('you do not have a "Ban Members" permission to use this command.')
    }
}