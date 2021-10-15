const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    category: 'Profile',
    description: 'Dysplays a users profile', // Required for slash commands
    
    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds
    
    callback: async ({ interaction }) => {
        
      let profileData;
      
      profileData = await profileModel.findOne({userID: interaction.member?.user.id });
      
      try{
        profileData = await profileModel.findOne({userID: interaction.member?.user.id });
        if(!profileData){
            let profile = await profileModel.create({
                userID: interaction.member?.user.id,
                serverID: interaction.guild?.id,
                
            });
            profile.save();
        }
        }catch(error){
            console.log(err);
    };
    profileData = await profileModel.findOne({userID: interaction.member?.user.id });
    const date = new Date()
    const embed = new Discord.MessageEmbed()
    .setAuthor("===================")
    .setTitle(`Profile of ${interaction.user.username}`)
    .setDescription(`Endorsements: **${profileData.endorsments}**\nCommunity Points: **${profileData.communityPoints}**\nChallenge Points: **${profileData.challangePoints}**`)
    .setColor("BLUE")
    .setFooter(`${interaction.member?.user.username}`)
    .setTimestamp(date)
    
    return embed
    },
  }