exports.run = async (client, message, args) => {
    if (message.member.hasPermission('BAN_MEMBERS', false, true, true)) {
        const user = message.mentions.users.first()
        if (user) {
            const unbanned = await client.models.bans.destroy({
                where: {
                    guildID: message.guild.id,
                    userID: user.id
                }
            })
            if (unbanned) {
                await message.reply(`${user.username} was unbanned from getting crowns in ${message.guild.name}.`)
            } else {
                await message.reply(`${user.username} was not banned. No changes were made.`)
            }
        } else {
            await message.reply('you must mention a user you want to ban.')
        }
    } else {
        await message.reply('you do not have a "Ban Members" permission to use this command.')
    }
}