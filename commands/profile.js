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
      
      if (userToGetProfile === null){ //Checking your own profile
        
      let profileData;
                 
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
            console.log(error);
    };
    profileData = await profileModel.findOne({userID: interaction.member?.user.id });
    let titlesString
    const titlesArray = profileData.titles
    if (titlesArray.length <= 0){
      titlesString = '**None**'
    }else{
      
    titlesString = `**${titlesArray.join('** - **')}**`
    }

    const date = new Date()
    const embed = new Discord.MessageEmbed()
    .setTitle(`Profile of ${interaction.user.username}`)
    .setDescription(`:medal: Community Awards: **${profileData.communityAwards}**\n\n:trophy: Event Trophies: **${profileData.eventTrophies}**\n\n:military_medal: Challange Trophiess: **${profileData.challangeTrophies}**\n\n:scroll: Titles: ${titlesString}`)
    .setColor("BLUE")
    .setFooter(`${interaction.member?.user.username}`)
    .setTimestamp(date)
    
    return embed
    }else{ //checking someone elses profile
      let profileData;
                 
      try{
        profileData = await profileModel.findOne({userID: userToGetProfile.id });
        if(!profileData){
            let profile = await profileModel.create({
                userID: userToGetProfile.id,
                serverID: interaction.guild?.id,
                userName: userToGetProfile.username,
                
            });
            profile.save();
        }
        }catch(error){
            console.log(error);
    };
    profileData = await profileModel.findOne({userID: userToGetProfile.id });
   
    let titlesString
    const titlesArray = profileData.titles
    if (titlesArray.length <= 0){
      titlesString = '**None**'
    }else{
      
    titlesString = `**${titlesArray.join('** - **')}**`
    }
    const date = new Date()
    const embed = new Discord.MessageEmbed()
    .setTitle(`Profile of ${userToGetProfile.username}`)
    .setDescription(`:medal: Community Awards: **${profileData.communityAwards}**\n\n:trophy: Event Trophies: **${profileData.eventTrophies}**\n\n:military_medal: Challange Trophiess: **${profileData.challangeTrophies}**\n\n:scroll: Titles: ${titlesString}`)
    .setColor("BLUE")
    .setFooter(`${interaction.member?.user.username}`)
    .setTimestamp(date)
    
    return embed
    }
  },
  }