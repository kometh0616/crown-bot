const Bot = require('./src/handler/CrownBot')
const { prefix, token, ownerID } = require('./config.json')

const bot = new Bot({
    prefix, token, ownerID
})

bot.init()