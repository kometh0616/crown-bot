module.exports = async (client, message) => {
    if (!message.content.startsWith(client.prefix) || message.channel.type !== 'text' || message.author.bot) {
        return
    }
    const args = message.content.slice(client.prefix.length).split(/ +/gi)
    const commandName = args.shift().toLowerCase()
    const command = client.commands.find(x => x.name === commandName || x.aliases.includes(commandName))
    if (!command) {
        return
    }
    await command.execute(client, message, args)
}