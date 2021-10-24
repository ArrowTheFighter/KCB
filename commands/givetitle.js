const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    category: 'Profile',
    description: 'Gives a user a title', // Required for slash commands
    
    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds
    
    options:[
        {
            name: 'user',
            description: 'user to give the title to',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.USER,
        },
        {
            name: 'title',
            description: 'the title to give the user',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    callback: async ({ interaction }) => {
        const userToGiveTitle = interaction.options.getUser('user')
        const title = interaction.options.getString('title')
        const { guild } = interaction
        const member = guild?.members.cache.get(interaction.user.id)
        const userRoles = member?.roles.cache.map(role => role)

      let profileData;
      
      
      try{
        profileData = await profileModel.findOne({userID: userToGiveTitle.id });
        if(!profileData){
            let profile = await profileModel.create({
                userID: userToGiveTitle.id,
                serverID: interaction.guild?.id,
                
            });
            profile.save();
        }
        }catch(error){
            console.log(err);
    };

    

    await profileModel.findOneAndUpdate({
        userID: userToGiveTitle.id,
    },{
        $push:{
            titles: title,
        }
    })

    profileData = await profileModel.findOne({userID: userToGiveTitle.id });
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${interaction.member.user.username} has given ${userToGiveTitle.username} the title ${title}`)
    .setColor("BLUE")
    
    return embed
    },
  }