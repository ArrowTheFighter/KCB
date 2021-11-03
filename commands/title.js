const profileModel = require('../models/profileSchema')
const titlesModel = require('../models/titlesSchema')
const myFuntions = require('../myFunctions')
const fs = require('fs')
const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    category: 'Profile',
    description: 'Manage a users titles',
    
    slash: true, 
    testOnly: true, 
    
    options:[
        {
            name: 'user',
            description: 'manage titles on a user',
            type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options:[

            
                {
                    name: 'give',
                    description: 'give a title to a user',
                    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                    options:[
                        {
                            name: 'user',
                            description: 'The user to give a title to',
                            required: true,
                            type: Discord.Constants.ApplicationCommandOptionTypes.USER,
                        }                        
                    ]
                },
                {
                    name: 'remove',
                    description: 'remove a title from a user',
                    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                    options:[
                        {
                            name: 'user',
                            description: 'The user to give a title to',
                            required: true,
                            type: Discord.Constants.ApplicationCommandOptionTypes.USER,
                        },
                    ]
                },
                {
                    name: 'check',
                    description: 'check a users titles',
                    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                    options:[
                        {
                            name: 'user',
                            description: 'The user to give a title to',
                            required: true,
                            type: Discord.Constants.ApplicationCommandOptionTypes.USER,
                        },
                    ]
                },
            ]
        },
        {
            name: 'database',
            description: 'manage the titles in the database',
            type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options:[
                {
                    name:'create',
                    description: 'Create a title and add it to the database',
                    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                    options:[
                        {
                            name:'title',
                            description: 'The name of the title to create',
                            required: true,
                            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: 'Delete a title from the database',
                    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                },
                {
                    name: 'list',
                    description: 'List all titles in the database',
                    type: Discord.Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                }

            ],
        }
            
    ],
    callback: async ({ interaction }) => {
        const userVar = interaction.options.getUser('user')
        let action = interaction.options.getSubcommand()
        const configString = fs.readFileSync('./configs/titleConfig.txt', {encoding:'utf8', flag:'r'})
        let hasPermission = myFuntions.CheckConfigRoles(interaction, configString)
        if(!hasPermission){
        return interaction.reply({content: `You don't have permission to use this command`})
        }

        const title = interaction.options.getString('title')
        let embed
        let profileData;
        let titlesData;
        switch(action){
            case 'give':

                try{
                    profileData = await profileModel.findOne({userID: userVar.id });
                    if(!profileData){
                        let profile = await profileModel.create({
                            userID: userVar.id,
                            userName: userVar.username,
                            serverID: interaction.guild?.id,
                        });
                        profile.save();
                    }
                    }catch(error){
                        console.log(error);
                };
                try{
                    titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                    if(!titlesData){
                        let profile = await titlesModel.create({
                            titlesID: 'MainTitles',  
                        });
                        profile.save();
                    }
                    }catch(error){
                        console.log(error);
                };
                titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                if (titlesData.storedTitles <= 0){
                    return interaction.reply({content: 'There are no titles in the database to give'})
                }else{
                    databaseTitles = titlesData.storedTitles
                    let titleList = []
                    databaseTitles.forEach(title => {
                        newValue = `${title},${userVar.id}`
                        titleList.push({
                            label: title,
                            value: newValue,
                            description: `Give the ${title} title to ${userVar.username}`,
                            emoji: ':x:',
                        })
                });
                const row = new Discord.MessageActionRow()
                .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('TitleGiveMenu')
                    .setPlaceholder('Choose Title to Give')
                    .setMaxValues(1)
                    .addOptions(titleList)
                )
                embed = new Discord.MessageEmbed()
                .setDescription(`Choose a title to delete`)
                .setColor("BLUE")
                return interaction.reply({embeds: [embed], components: [row]})
                }
                // await profileModel.findOneAndUpdate({
                //         userID: userVar.id,
                //     },{
                //         $push:{
                //             titles: title,
                //         }
                //     })
                // embed = new Discord.MessageEmbed()
                // .setAuthor(`${interaction.member.user.username} has given ${userVar.username} the title ${title}`)
                // .setColor("BLUE")

                return embed
                break;
            case 'remove':
                try{
                    profileData = await profileModel.findOne({userID: userVar.id });
                    if(!profileData){
                        let profile = await profileModel.create({
                            userID: userVar.id,
                            userName: userVar.username,
                            serverID: interaction.guild?.id,

                            
                            
                        });
                        profile.save();
                    }
                    }catch(error){
                        console.log(error);
                };
                profileData = await profileModel.findOne({userID: userVar.id });
                const userTitles = profileData.titles

                if(userTitles.length <= 0){
                    return interaction.reply({content: 'that user has no titles', ephemeral: true})
                }else{
                let titleList = []
                userTitles.forEach(title => {
                    newValue = `${title},${userVar.id}`
                    titleList.push({
                        label: title,
                        value: newValue,
                        description: `Remove the ${title} title from this user`,
                        emoji: ':x:',
                    })
                });
                const row = new Discord.MessageActionRow()
                .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('TitleRemoveMenu')
                    .setPlaceholder('Choose Title to remove')
                    .setMaxValues(1)
                    .addOptions(titleList)
                )
                embed = new Discord.MessageEmbed()
                .setDescription(`Choose a title to remove`)
                .setColor("BLUE")
                return interaction.reply({embeds: [embed], components: [row], ephemeral: true})
                }
                    break;
                case 'check':
                    try{
                        profileData = await profileModel.findOne({userID: userVar.id });
                        if(!profileData){
                            let profile = await profileModel.create({
                                userID: userVar.id,
                                userName: userVar.username,
                                serverID: interaction.guild?.id,
    
                                
                                
                            });
                            profile.save();
                        }
                        }catch(error){
                            console.log(error);
                    };
                    profileData = await profileModel.findOne({userID: userVar.id });
                    let titles = profileData.titles
                    if(titles.length <= 0){
                        return interaction.reply({content: `${userVar.username} has no titles`, ephemeral: true})
                    }else{
                        titlesString = titles.join('\n')
                        embed = new Discord.MessageEmbed()
                        .setDescription(`${userVar.username} has the following titles:\n\n **${titlesString}**`)
                        .setColor("BLUE")
                        return interaction.reply({embeds: [embed]})
                    }

                    break;
                case 'create':                    
                    try{
                        titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                        if(!titlesData){
                            let profile = await titlesModel.create({
                                titlesID: 'MainTitles',  
                            });
                            profile.save();
                        }
                        }catch(error){
                            console.log(error);
                    };
                    await titlesModel.findOneAndUpdate({
                        titlesID: 'MainTitles',
                    },{
                        $push:{
                            storedTitles: title,
                        }
                    })
                    embed = new Discord.MessageEmbed()
                        .setDescription(`${interaction.user.username} has the created the **${title}** title`)
                        .setColor("BLUE")
                        return interaction.reply({embeds: [embed]})
                    break;

                case 'delete':
                    try{
                        titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                        if(!titlesData){
                            let profile = await titlesModel.create({
                                titlesID: 'MainTitles',  
                            });
                            profile.save();
                        }
                        }catch(error){
                            console.log(error);
                    };
                    titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                    if (titlesData.storedTitles <= 0){
                        return interaction.reply({content: 'There are no titles in the database to delete'})
                    }else{
                        databaseTitles = titlesData.storedTitles
                        let titleList = []
                        databaseTitles.forEach(title => {
                            titleList.push({
                                label: title,
                                value: title,
                                description: `Remove the ${title} title from the database`,
                                emoji: ':x:',
                            })
                    });
                    const row = new Discord.MessageActionRow()
                    .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('TitleDatabaseDeleteMenu')
                        .setPlaceholder('Choose Title to delete')
                        .setMaxValues(1)
                        .addOptions(titleList)
                    )
                    embed = new Discord.MessageEmbed()
                    .setDescription(`Choose a title to delete`)
                    .setColor("BLUE")
                    return interaction.reply({embeds: [embed], components: [row]})
                    }
                    
                break;
                case 'list':
                    try{
                        titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                        if(!titlesData){
                            let profile = await titlesModel.create({
                                titlesID: 'MainTitles',  
                            });
                            profile.save();
                        }
                        }catch(error){
                            console.log(error);
                    };
                    titlesData = await titlesModel.findOne({titlesID: 'MainTitles' });
                    if (titlesData.storedTitles <= 0){
                        return interaction.reply({content: 'There are no titles in the database to list'})
                    }else{
                        titlesDString = titlesData.storedTitles.join('\n')
                        embed = new Discord.MessageEmbed()
                        .setDescription(`The database has the following titles:\n\n **${titlesDString}**`)
                        .setColor("BLUE")
                        return interaction.reply({embeds: [embed]})
                    }
                break;
        }
        const { guild } = interaction
        const member = guild?.members.cache.get(interaction.user.id)
        const userRoles = member?.roles.cache.map(role => role)

    
    return 'test'
    },
  }