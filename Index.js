const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const fs = require('fs')
dotenv.config()
const { Intents } = DiscordJS

const client = new DiscordJS.Client({
  // These intents are recommended for the built in help menu
  partials: [
    "CHANNEL"
  ],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
})

mongoose
    .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to the database');
    })
    .catch((error) => { 
    console.log(error);
    })

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.on('guildMemberAdd', async (member) =>{
    const profileModel = require('./models/profileSchema');

    let profile = await profileModel.create({
        userID: member.id,
        serverID: member.guild.id,
        endorsments: 0,
        communityPoints: 0,
    });
    profile.save();
    console.log('user joined')
})



client.login(process.env.TOKEN)