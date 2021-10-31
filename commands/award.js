const profileModel = require('../models/profileSchema')
const MyFuntions = require('../myFunctions')
const Discord = require('discord.js')
require('dotenv').config()
const fs = require('fs')
const myFunctions = require('../myFunctions')

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
        const OS = process.platform
        const cooldownTime = 86400000
        configArray = myFunctions.ConfigToArrayOS(configString)
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

            let userProfileData
            let profileData;
            if (userToAward?.id === interaction.member.user.id){
                return interaction.reply({content: 'You cannont endorse yourself', epemeral: true})
            } else{

                try{
                    userProfileData = await profileModel.findOne({userID: interaction.user.id});
                    if(!userProfileData){
                        let profile = await profileModel.create({
                            userID: interaction.user.id,
                            serverID: interaction.guild?.id,
                            
                        });
                        profile.save();
                    }
                    }catch(error){
                        console.log(error);
                };
                userProfileData = await profileModel.findOne({userID: interaction.user.id});
                
                if(typeof userProfileData.CACooldown == 'undefined'){
                    console.log(userProfileData.CACooldown)
                }else{
                    const cooldownCheck = parseInt(userProfileData.CACooldown) + cooldownTime
                    if (cooldownCheck <= Date.now()){
                        console.log('enough time has passed')
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
        
                        await profileModel.findOneAndUpdate({
                            userID: interaction.user.id,
                        },{
                            $set:{
                                CACooldown: Date.now(),
                            }
                        })
                        console.log(Date.now())
        
                        profileData = await profileModel.findOne({userID: userToAward.id});
        
                        const embed = new Discord.MessageEmbed()
                        .setTitle(`:medal: **${interaction.member.user.username}** has awarded **${userToAward.username}** with a community award! :medal:`)
                        .setColor("BLUE")
                        .setFooter(`${userToAward.username} now has ${profileData.communityAwards} community awards.`)
                        
                        return embed
                        
                    }else{
                        const milli = Date.now() - parseInt(userProfileData.CACooldown)
                        const timeLeft = cooldownTime - milli
                        console.log(Math.floor(timeLeft/1000))
                        if(Math.floor(timeLeft/1000) <= 60){
                            timeLeftFinal = `${Math.floor(timeLeft/1000)} seconds`
                        }else if(Math.floor(timeLeft/1000) <= 120){
                            timeLeftFinal = `${Math.floor(timeLeft/60000)} minute`
                        }else if(Math.floor(timeLeft/1000) <= 3600){
                            timeLeftFinal = `${Math.floor(timeLeft/60000)} minutes`
                        }else if(Math.floor(timeLeft/1000) <= 7200){
                            timeLeftFinal = `${Math.floor(timeLeft/3600000)} hour`
                        }else if(Math.floor(timeLeft/1000) <= 86400){
                            timeLeftFinal = `${Math.floor(timeLeft/3600000)} hours`
                        }
                        return interaction.reply({content: `This command is on cooldown. You need to wait ${timeLeftFinal}`, ephemeral: true})
                    }
                }

                
            }
        }
    },
  }