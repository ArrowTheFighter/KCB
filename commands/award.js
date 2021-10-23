const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
require('dotenv').config()
const fs = require('fs')

module.exports = {
    category: 'Profile',
    description: 'Award a user with a community award',
    
    slash: true, 
    testOnly: true,
    options: [
        {
            name: 'usertoaward',
            description: 'The user to recieve the award',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.USER,
        }
    ],
    
    callback: async ({ interaction, options }) => {
        const userToAward = interaction.options.getUser('usertoaward')
        const { guild } = interaction
        const member = guild?.members.cache.get(interaction.user.id)
        const userRoles = member?.roles.cache.map(role => role)
        const configString = fs.readFileSync('./configs/awardConfig.txt', {encoding:'utf8', flag:'r'})
        configArray = configString.split('\r\n')
        let hasRole = false
        userRoles.forEach(role => {
            configArray.forEach(roleID =>{
                
                if (role.id === roleID){
                    hasRole = true
                }
            })
        });
        if(hasRole === false){
            return interaction.reply({content: "You do not have the required role to use this command", ephemeral: true})
        }else{

        
            let profileData;
            if (userToAward?.id === interaction.member.user.id){
                return interaction.reply({content: 'You cannont endorse yourself', epemeral: true})
            } else{

        
        
                try{
                    profileData = await profileModel.findOne({userID: userToAward.id});
                    if(!profileData){
                        let profile = await profileModel.create({
                            userID: userToAward.id,
                            serverID: interaction.guild?.id,
                            
                        });
                        profile.save();
                    }
                    }catch(error){
                        console.log(error);
                };

                await profileModel.findOneAndUpdate({
                    userID: userToAward.id,
                },{
                    $inc:{
                        communityAwards: 1,
                    }
                })

                profileData = await profileModel.findOne({userID: userToAward.id});

                const embed = new Discord.MessageEmbed()
                .setTitle(`:medal: **${interaction.member.user.username}** has awarded **${userToAward.username}** with a community award! :medal:`)
                .setColor("BLUE")
                .setFooter(`${userToAward.username} now has ${profileData.communityAwards} community awards.`)
                
                return embed
            }
        }
    },
  }