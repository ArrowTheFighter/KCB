const Discord = require('discord.js');
const profileModel = require('../models/profileSchema')
const titlesModel = require('../models/titlesSchema')
const myFuntions = require('../myFunctions')
const fs = require('fs');
const myFunctions = require('../myFunctions');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute (interaction, client){
        if(interaction.isSelectMenu() || interaction.isButton()){
            const { guild } = interaction
            let embed
            let row
            let buttonRow
            let roleName
            switch (interaction.customId){
            case 'ColorMenu':
                    
                    const member = guild?.members.cache.get(interaction.user.id)
                    const roles = member?.roles.cache.map(role => role)
                    const ColorRoles = ["898962477377798204", '898962420779868220', '898962331143405568','898962581467828274','898962762640814120','898962867976536094','900949035177889813']

                    roles?.forEach(role =>{
                        ColorRoles.forEach(string =>{
                            if (role.id === string){
                                member?.roles.remove(string)
                            }
                        })
                    })

                    switch(interaction.values[0]){
                        case 'fadedGreen':
                            //Faded Green
                            member?.roles.add('898962477377798204')
                            
                            interaction.reply({
                                content: `Your color is now faded green`,
                                ephemeral: true
                            })
                            
                        break;
                    case 'darkGreen':
                            //Dark Green
                            member?.roles.add('898962420779868220')
                            interaction.reply({
                                content: `Your color is now dark green`,
                                ephemeral: true
                            })
                            
                    
                        break;
                    case 'lightGreen':
                            //Light Green
                            member?.roles.add('898962331143405568')
                            interaction.reply({
                                content: `Your color is now light green`,
                                ephemeral: true
                            })
                            
                    
                        break;
                    case 'darkPurple':
                            //Dark Purple
                            member?.roles.add('898962581467828274')
                            interaction.reply({
                                content: `Your color is now light green`,
                                ephemeral: true
                            })
                            
                    
                        break;
                    case 'lightPurple':
                            //Light Purple
                            member?.roles.add('898962762640814120')
                            interaction.reply({
                                content: `Your color is now light green`,
                                ephemeral: true
                            })
                            
                    
                        break;
                    case 'darkPink':
                            //Dark Pink
                            member?.roles.add('898962867976536094')
                            interaction.reply({
                                content: `Your color is now light green`,
                                ephemeral: true
                            })
                            
                    
                        break;
                    case 'peach':
                            //Peach
                            member?.roles.add('900949035177889813')
                            interaction.reply({
                                content: `Your color is now peach`,
                                ephemeral: true
                            })
                            
                    
                        break;
                    return
                        }
                    break;
                case 'TitleRemoveMenu':
                    splitValue = interaction.values[0].split(',')

                    profileData = await profileModel.findOne({userID: splitValue[1] });

                    const oldTitles = profileData.titles
                    newTitles = oldTitles.filter(e => e !== splitValue[0])
                    
                    if (newTitles.legnth <= 0){
                        newTitles = []
                    }
                    await profileModel.findOneAndUpdate({
                        userID: splitValue[1],
                    },{
                        $set:{
                            titles: newTitles,
                        }
                    })
                    user = interaction.client.users.cache.find(user => user.id === splitValue[1])
                    embed = new Discord.MessageEmbed()
                    .setDescription(`**${interaction.member.user.username}** has removed the **${splitValue[0]}** title from **${user.username}**`)
                    .setColor("BLUE")

                    interaction.update({embeds: [embed], components: []})
                break;
                case 'TitleDatabaseDeleteMenu':

                    titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                    const oldDTitles = titlesData.storedTitles
                    newDTitles = oldDTitles.filter(e => e !== interaction.values[0])
                    await titlesModel.findOneAndUpdate({
                        titlesID: 'MainTitles',
                    },{
                        $set:{
                            storedTitles: newDTitles,
                        }
                    })
                    embed = new Discord.MessageEmbed()
                    .setDescription(`**${interaction.user.username}** has removed the **${interaction.values[0]}** title from the database`)
                    .setColor("BLUE")

                    interaction.update({embeds: [embed], components: []})
                break;


                case 'TitleGiveMenu':
                    splitValue = interaction.values[0].split(',')

                    profileData = await profileModel.findOne({userID: splitValue[1] });

                    await profileModel.findOneAndUpdate({
                        userID: splitValue[1],
                    },{
                        $push:{
                            titles: splitValue[0],
                        }
                    })
                    user = interaction.client.users.cache.find(user => user.id === splitValue[1])
                    embed = new Discord.MessageEmbed()
                    .setDescription(`**${interaction.member.user.username}** has given the **${splitValue[0]}** title to **${user.username}**`)
                    .setColor("BLUE")


                    interaction.update({embeds: [embed], components: []})
                break;


                case 'ConfigEditMenu':
                    
                    let ActionList = [
                    {
                        label: 'Add',
                        value: `add,${interaction.values[0]}`,
                        description: `Add a role to this config`,
                    },
                    {
                        label: 'Remove',
                        value: `remove,${interaction.values[0]}`,
                        description: `Remove a role from this config`,
                    },
                    {
                        label: 'List',
                        value: `list,${interaction.values[0]}`,
                        description: `List the roles in this config`,
                    }
                ]
                

                embed = new Discord.MessageEmbed()
                .setDescription(`Choose an action`)
                .setColor("RED")
                
                row = new Discord.MessageActionRow()
                .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('ConfigActionEditMenu')
                    .setPlaceholder('Choose Action')
                    .setMaxValues(1)
                    .addOptions(ActionList)
                )
                buttonRow = new Discord.MessageActionRow()
                .addComponents(
                new Discord.MessageButton()
                    .setCustomId('chooseActionBack')
                    .setLabel('Back')
                    .setStyle('DANGER')
                )
                interaction.update({embeds: [embed], components: [row, buttonRow], ephemeral: true})
                break;

                case 'chooseActionBack':
                    const configFiles = fs.readdirSync('./configs').filter(file => file.endsWith('.txt'));

                    let fileList = []
        
                        configFiles.forEach(file =>{
                            fileList.push({
                                label: file,
                                value: file,
                                description: `Edit the ${file} file`,                        
                            })
                        })
        
                        embed = new Discord.MessageEmbed()
                        .setDescription(`Choose a file to edit`)
                        .setColor("GREEN")
                        
                        row = new Discord.MessageActionRow()
                        .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId('ConfigEditMenu')
                            .setPlaceholder('Choose file')
                            .setMaxValues(1)
                            .addOptions(fileList)
                        )
                        interaction.update({embeds: [embed], components: [row], ephemeral: true})
                break;

                case 'ConfigActionEditMenu':
                    splitValue = interaction.values[0].split(',')
                    switch(splitValue[0]){
                        case 'remove':
                            fileString = fs.readFileSync(`./configs/${splitValue[1]}`, {encoding:'utf8', flag:'r'})
                            fileArray = JSON.parse(fileString)

                            let RoleList = []
                            fileArray.forEach(role =>{
                                roleName = interaction.guild.roles.cache.get(role).name
                                RoleList.push({
                                    label: roleName,
                                    value: `${role}-${splitValue[1]}`,
                                    description: `Remove the ${roleName} role`,
                                })
                            })  
                            embed = new Discord.MessageEmbed()
                            .setDescription(`Choose a role to remove from the config file`)
                            .setColor("YELLOW")
                            
                            row = new Discord.MessageActionRow()
                            .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId('ConfigRemoveMenu')
                                .setPlaceholder('Choose a role')
                                .setMaxValues(1)
                                .addOptions(RoleList)
                            )
                            buttonRow = new Discord.MessageActionRow()
                                .addComponents(
                                new Discord.MessageButton()
                                    .setCustomId('configCancel')
                                    .setLabel('Cancel')
                                    .setStyle('DANGER')
                                )
                            interaction.update({embeds: [embed], components: [row, buttonRow], ephemeral: true})

                        break;

                        case 'add':
                            const serverRoles = interaction.guild.roles.cache.map(role => role)
                            serverRoles.splice(0,1)

                            let ServerRoleList = []
                            serverRoles.forEach(role =>{
                                
                                ServerRoleList.push({
                                    label: role.name,
                                    value: `${role.id}-${splitValue[1]}`,
                                    description: `Add the ${role.name} role`,
                                })
                            })  
                            embed = new Discord.MessageEmbed()
                            .setDescription(`Choose a role to add to the config file`)
                            .setColor("YELLOW")
                            
                            row = new Discord.MessageActionRow()
                            .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId('ConfigAddMenu')
                                .setPlaceholder('Choose a role')
                                .setMaxValues(1)
                                .addOptions(ServerRoleList)
                            )
                            buttonRow = new Discord.MessageActionRow()
                            .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('configCancel')
                                .setLabel('Cancel')
                                .setStyle('DANGER')
                            )
                            interaction.update({embeds: [embed], components: [row, buttonRow], ephemeral: true})
                        break;

                        case 'list':
                            fileString = fs.readFileSync(`./configs/${splitValue[1]}`, {encoding:'utf8', flag:'r'})
                            fileArray = JSON.parse(fileString)
                            if (fileArray.length === 0){
                                embed = new Discord.MessageEmbed()
                                    .setDescription(`The ${splitValue[1]} file contains no roles`)
                                    .setColor("YELLOW")
                                return interaction.update({embeds: [embed], components: [], ephemeral: true})
                            }else{
                            roleNames = []
                            fileArray.forEach(roleID =>{
                                roleName = interaction.guild.roles.cache.get(roleID).name
                                
                                roleNames.push(roleName)
                            })
                            roleNamesString = roleNames.join('\n')
                            embed = new Discord.MessageEmbed()
                            .setDescription(`The ${splitValue[1]} file contains the following roles \n\n${roleNamesString}`)
                            .setColor("YELLOW")
                            interaction.update({embeds: [embed], components: [], ephemeral: true})
                        }
                        break;
                    }
                break;


                case 'configCancel':
                    embed = new Discord.MessageEmbed()
                        .setDescription(`This command has been canceled`)
                        .setColor("RED")
                    interaction.update({embeds: [embed], components: [], ephemeral: true})
                break;


                case 'ConfigRemoveMenu':
                    splitValue = interaction.values[0].split('-')
                    fileString = fs.readFileSync(`./configs/${splitValue[1]}`, {encoding:'utf8', flag:'r'})
                    fileArray = JSON.parse(fileString)
                    let success = false
                    for (let i = 0; i < fileArray.length; i++){
                        if(fileArray[i] === splitValue[0]){
                            fileArray.splice(i, 1)
                            success = true
                            break;
                        }
                    }
                    if(success){
                        fileJson = JSON.stringify(fileArray)
                        fs.writeFileSync(`./configs/${splitValue[1]}`, fileJson)
                        console.log(`wrote file ${splitValue[1]}`)

                        roleName = interaction.guild.roles.cache.get(splitValue[0]).name
                        embed = new Discord.MessageEmbed()
                            .setDescription(`The ${roleName} role has been removed from the ${splitValue[1]} file`)
                            .setColor("GREEN")
                            interaction.update({embeds: [embed], components: [], ephemeral: true})
                    } else{
                        embed = new Discord.MessageEmbed()
                            .setDescription(`Something went wrong. Please contact the bot developer`)
                            .setColor("RED")
                        interaction.update({embeds: [embed], components: [], ephemeral: true})
                    }
                break;


                case 'ConfigAddMenu':
                    splitValue = interaction.values[0].split('-')
                    fileString = fs.readFileSync(`./configs/${splitValue[1]}`, {encoding:'utf8', flag:'r'})
                    fileArray = JSON.parse(fileString)

                    fileArray.push(splitValue[0])
                    console.log(fileArray)

                    fileJson = JSON.stringify(fileArray)
                    fs.writeFileSync(`./configs/${splitValue[1]}`, fileJson)
                    console.log(`wrote file ${splitValue[1]}`)


                    roleName = interaction.guild.roles.cache.get(splitValue[0]).name
                    embed = new Discord.MessageEmbed()
                            .setDescription(`The ${roleName} role has been added to the ${splitValue[1]} file`)
                            .setColor("GREEN")
                            interaction.update({embeds: [embed], components: [], ephemeral: true})
                break;
        }
        
    }
}}