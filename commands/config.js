const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
const myFuntions = require('../myFunctions')
const fs = require('fs')
require('dotenv').config()

module.exports = {
    category: 'Profile',
    description: 'Dysplays a users profile', // Required for slash commands
    
    slash: true, // Create both a slash and legacy command
    testOnly: true, // Only register a slash command for the testing guilds
    
    options: [
      {
        name: 'edit',
        description: 'Edit the config files for all commands',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND
      }
    ],

    callback: async ({ interaction }) => {
        let action = interaction.options.getSubcommand()
        
        const configJson = fs.readFileSync('./configs/configConfig.txt', {encoding:'utf8', flag:'r'})
        const configArray = JSON.parse(configJson)
        let hasPermission = myFuntions.CheckConfigRoles(interaction, configArray)

        if(!hasPermission){
            return interaction.reply({content:`You don't have the required permission to use this command`, ephemeral: true})
        }

        switch(action){
            case 'edit':
            const configFiles = fs.readdirSync('./configs').filter(file => file.endsWith('.txt'));

            let fileList = []

                configFiles.forEach(file =>{
                    fileList.push({
                        label: file,
                        value: file,
                        description: `Edit the ${file} file`,                        
                    })
                })

                const embed = new Discord.MessageEmbed()
                .setDescription(`Choose a file to edit`)
                .setColor("GREEN")
                
                const row = new Discord.MessageActionRow()
                .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('ConfigEditMenu')
                    .setPlaceholder('Choose file')
                    .setMaxValues(1)
                    .addOptions(fileList)
                )
                interaction.reply({embeds: [embed], components: [row], ephemeral: true})
                
            break;

        }
    }
}