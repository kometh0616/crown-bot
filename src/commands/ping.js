const Command = require('../handler/Command')

class PingCommand extends Command {

    constructor() {
        super({
            name: 'ping',
            description: 'Pings.',
            usage: ['ping']
        })
    }

    async run(client, message, args) {
        await message.channel.send('Pong!')
    }

}

module.exports = PingCommand