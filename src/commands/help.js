const Command = require('../handler/Command')

class HelpCommand extends Command {

    constructor() {
        super({
            name: 'help',
            description: 'Shows you a help message.',
            usage: ['help', 'help <command>'],
            aliases: ['h']
        })
    }

    async run(client, message, args) {
        if (args[0]) {
            const command = client.commands.find(x => x.name === args[0] || x.aliases.includes(args[0]))
            if (command) {
                const info = `Name: ${command.name}\n` +
                `Description: ${command.description}\n` + 
                `Usage: ${command.usage.map(x => `${client.prefix}${x}`).join(', ')}\n` +
                `Shortcuts: ${command.aliases.length !== 0 ? command.aliases.join('\n') : 'none'}`
                if (!command.hidden) {
                    await message.channel.send(info)
                }
            } else {
                await message.reply(`no command under the name of ${args[0]} found.`)
            }
        } else {
            const info = client.commands
                .filter(x => !x.hidden)
                .map(x => `${client.prefix}${x.name} - ${x.description}`)
                .join('\n') + `\n\nDo ${client.prefix}help <command> for more info!`
            await message.channel.send(info)
        }
    }

}

module.exports = HelpCommand