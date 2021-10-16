const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
const fs = require('fs')
require('dotenv').config()

module.exports = {
    category: 'Event',
    description: 'Verify with a passcode', // Required for slash commands
    
    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds

    options: [{
            name:'passcode',
            description:'Enter your provided passcode',
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }],
    
    
    callback: async ({ interaction }) => {
        if(interaction.member.roles.cache.some(role => role.name === 'Mod')){
           
        let replyMessage = 'incorrect code'
        const passcode = interaction.options.getString('passcode')

        const passwordsList = fs.readFileSync('./passwords/passwords.txt', {encoding:'utf8', flag:'r'} )
        
        const passwordsArray = passwordsList.split('\n')
        
        console.log(passwordsArray)
        let pos = 0
        passwordsArray.forEach(code => {
            //console.log(code + ' ' + passcode)
            if(code === passcode){
                replyMessage = 'correct code'
                passwordsArray.splice(pos, 1)
                console.log(passwordsArray)
                
            }
            pos += 1
            
         });
         
    return interaction.reply({content: replyMessage, ephemeral: true})
    }else{
        return interaction.reply({content: "You don't have permission to use this command", ephemeral: true})
    }
    }
  }