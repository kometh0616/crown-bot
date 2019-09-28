const Command = require('../src/handler/Command')

class ExampleCommand extends Command {

    constructor() {
        super({
            name: 'example',
            description: 'This is an example of a command.',
            usage: ['example', 'example <some args>'],
            aliases: ['e'],
            hidden: true,
            ownerOnly: true
        })
    }

    async run(client, message, args) {
        await message.channel.send('This is a message.')
    }

}

module.exports = ExampleCommand