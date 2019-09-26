exports.run = async (client, message, args) => {
    if (message.member.hasPermission('BAN_MEMBERS', false, true, true)) {
        const user = message.mentions.users.first()
        if (user) {
            const amount = await client.models.crowns.destroy({
                where: {
                    guildID: message.guild.id,
                    userID: user.id
                }
            })
            if (amount) {
                await message.reply(`${user.username}'s crowns were reset. ${amount} crowns were deleted.`)
            } else {
                await message.reply(`${user.username} had no crowns. No changes were made.`)
            }
        } else {
            await message.reply('you must mention a user whose crowns you want to reset.')
        }
    } else {
        await message.reply('you do not have a "Ban Members" permission to use this command.')
    }
}