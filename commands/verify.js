const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
const fs = require('fs')
const myFuntions = require('../myFunctions')
const { join } = require('path')
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
        const configJson = fs.readFileSync('./configs/verifyConfig.txt', {encoding:'utf8', flag:'r'})
        const configArray = JSON.parse(configJson)
        let hasRole = myFuntions.CheckConfigRoles(interaction, configArray)
        if(hasRole === false){
            return interaction.reply({content: "❌ You do not have the required role to use this command ❌", ephemeral: true})
        }else{
           
        let replyMessage = 'incorrect code'
        const passcode = interaction.options.getString('passcode')

        const passwordsList = fs.readFileSync('./passwords/passwords.txt', {encoding:'utf8', flag:'r'} )
        
        const passwordsArray = passwordsList.split('\n')

        let pos = 0
        passwordsArray.forEach(code => {
            //console.log(code + ' ' + passcode)
            if(code === passcode){
                replyMessage = 'correct code'
                fs.appendFile('./passwords/usedpasswords.txt',code + ` ${interaction.user.username} id = ${interaction.user.id}\n`, (error) =>{
                    if (error) console.log(err.message)
                    else console.log(`removed ${code}`)
                })
                
                passwordsList.split('\r\n').splice(pos,1,)
                //console.log(passwordsList + ' old')
                const arrayPasswords = passwordsList.split('\n')
                const updatedPasswords = arrayPasswords.splice(pos,1)
                const joinedPasswords = arrayPasswords.join('\n')

                fs.writeFileSync('./passwords/passwords.txt', joinedPasswords)
                //passwordsArray.splice(pos, 1)
                //console.log(oldPasswords)
                
            }
            pos += 1
            //console.log(code + ' ' + passcode)
         });
         
        return interaction.reply({content: replyMessage, ephemeral: true})
        }
    }
  }