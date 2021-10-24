const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    category: 'Profile',
    description: 'Dysplays a users profile', // Required for slash commands
    
    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds
    
    options: [
      {
        name: 'user',
        description: 'The user to check thier profile',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
      }
    ],

    callback: async ({ interaction }) => {
      const userToGetProfile = interaction.options.getUser('user')
      
      if (userToGetProfile === null){
        console.log('no one was mentioned')
      }

      let profileData;
      
      profileData = await profileModel.findOne({userID: interaction.member?.user.id });
      
      try{
        profileData = await profileModel.findOne({userID: interaction.member?.user.id });
        if(!profileData){
            let profile = await profileModel.create({
                userID: interaction.member?.user.id,
                serverID: interaction.guild?.id,
                userName: interaction.member.user.username,
                
            });
            profile.save();
        }
        }catch(error){
            console.log(err);
    };
    profileData = await profileModel.findOne({userID: interaction.member?.user.id });

    const titlesArray = profileData.titles
    titlesString = titlesArray.join(' **-** ')

    const date = new Date()
    const embed = new Discord.MessageEmbed()
    //.setAuthor("===================")
    .setTitle(`Profile of ${interaction.user.username}`)
    .setDescription(`:medal: Community Awards: **${profileData.communityAwards}**\n\n:trophy: Event Trophies: **${profileData.eventTrophies}**\n\n:military_medal: Challange Trophiess: **${profileData.challangeTrophies}**\n\n:scroll: Titles: **${titlesString}**`)
    .setColor("BLUE")
    .setFooter(`${interaction.member?.user.username}`)
    .setTimestamp(date)
    
    return embed
    },
  }