class Command {
    
    constructor(options) {
        this.name = options.name
        this.description = options.description
        this.usage = options.usage || []
        this.aliases = options.aliases || []
        this.hidden = options.hidden
        this.ownerOnly = options.ownerOnly
    }

    async execute(client, message, args) {
        try {
            await this.run(client, message, args)
            await this.log(message)
        } catch (e) {
            console.error(e)
            await this.log(message, e.stack)
        }
    }

    async log(message, stack) {
        const ctx = `Command ${this.name} executed!
Message content: ${message.content} (${message.id})
Executor: ${message.author.tag} (${message.author.id})
Guild: ${message.guild.name} (${message.guild.id})
Channel: ${message.channel.name} (${message.channel.id})
Timestamp: ${new Date().toUTCString()}
Stack: ${stack || `none`}
`
        message.client.logFile.write(ctx)
    }
    
}

module.exports = Command