### Crown Bot

If you are reading this, you are probably here because FMcord's `&whoknows` command was taken down. We could no longer sustain this feature, so we had to shut it down. This bot includes most of the functionality FMcord had within its crown system.

Command `&whoknows` was removed because it was making a lot of API requests. This hasn't changed in this bot. **It is your responsibility to ensure that the bot will not make too many requests. If you get API banned for using this bot, it is your problem.**

To run the bot, do the following:
1. Clone this project by doing `git clone https://github.com/kometh0616/crown-bot.git` in your Terminal or Command Line, depending on your system.
2. Enter the cloned folder by doing `cd crown-bot` Do not close the terminal just yet.
3. Get a Discord token for your bot, you can get one [here](https://discordapp.com/developers/applications/)
4. Get a Last.fm API key, you can apply for one [here](https://www.last.fm/api/account/create)
5. Write those credentials down, as you will need them later.
6. Create a new file, called `config.json`.
7. Populate it as shown on `config.example.json`. You have to fill in all the values.
8. Run the bot by doing `node index.js` in your terminal.

If you want to add more commands to the bot, consider seeing `command.example.js`. Note that you need to have an intermediate knowlege of JavaScript in order to create more commands.