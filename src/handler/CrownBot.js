const { Client, SnowflakeUtil } = require('discord.js')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const express = require('express')
const http = require('http')

class CrownBot extends Client {

    constructor(botOptions, clientOptions) {
        super(clientOptions)
        this.prefix = botOptions.prefix
        this.token = botOptions.token
        this.ownerID = botOptions.ownerID
        this.apikey = botOptions.apikey
        this.commands = []
        this.sequelize = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: 'database.sqlite'
        })
        this.queryInterface = this.sequelize.getQueryInterface()
        this.models = {}
        this.url = 'https://ws.audioscrobbler.com/2.0/?'
    }

    loadCommands(dir = path.join(__dirname, '../commands')) {
        const commands = fs.readdirSync(dir)
        commands.forEach(file => {
            if (file.endsWith('.js')) {
                if (file.startsWith('banwhoknows') && process.argv[2] === '--oh-please-give-me-the-banwhoknows-command-i-beg-of-you') {
                    const Command = require(path.join(dir, file))
                    const command = new Command()
                    this.commands.push(command)
                } else if (!file.startsWith('banwhoknows')) {
                    const Command = require(path.join(dir, file))
                    const command = new Command()
                    this.commands.push(command)
                }
            }
        })
        return this
    }

    loadEvents(dir = path.join(__dirname, '../events')) {
        const events = fs.readdirSync(dir)
        events.forEach(file => {
            const [ eventName ] = file.split('.')
            const props = require(path.join(dir, file))
            this.on(eventName, props.bind(null, this))
        })
        return this
    }

    loadModels(dir = path.join(__dirname, '../models')) {
        const models = fs.readdirSync(dir)
        models.forEach(file => {
            const model = this.sequelize.import(path.join(dir, file))
            model.sync()
            const [ modelName ] = file.split('.')
            this.models[modelName.toLowerCase()] = model 
        })
        return this
    }

    configureLogging() {
        const p = path.join(__dirname, `../../logs`)
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p)
        }
        this.logFile = fs.createWriteStream(`${p}/${SnowflakeUtil.generate()}.txt`)
        return this
    }

    createExpressListener() {
        const app = express()

        app.get('/', (request, response) => {
            response.sendStatus(200)
        })

        app.listen(process.env.PORT)

        setInterval(() => {
            http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me`)
        }, 280000);

        return this;
    }

    init() {
        this.loadCommands()
            .loadEvents()
            .loadModels()
            .createExpressListener()
            .configureLogging()
            .login(this.token)
            .catch(e => console.log(`An error occurred when attempting to log in. ${e}`))
            .then(f => {
                if (f) {
                    console.log('Logged in.')
                }
            })
    }
}

module.exports = CrownBot;
