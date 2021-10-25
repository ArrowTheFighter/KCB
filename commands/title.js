const profileModel = require('../models/profileSchema')
const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    category: 'Profile',
    description: 'Manage a users titles',
    
    slash: true, 
    testOnly: true, 
    
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
                        },
                        {
                            name: 'title',
                            description: 'The title to give to the user',
                            required: true,
                            type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
                        },
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
            
    ],
    callback: async ({ interaction }) => {
        const userVar = interaction.options.getUser('user')
        let action = interaction.options.getSubcommand()

        let profileData;
        switch(action){
            case 'give':
                const title = interaction.options.getString('title')

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
                await profileModel.findOneAndUpdate({
                        userID: userVar.id,
                    },{
                        $push:{
                            titles: title,
                        }
                    })
                const embed = new Discord.MessageEmbed()
                .setAuthor(`${interaction.member.user.username} has given ${userVar.username} the title ${title}`)
                .setColor("BLUE")

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
                let count = 1
                userTitles.forEach(title => {
                    newValue = `${title},${userVar.id}`
                    titleList.push({
                        label: title,
                        value: newValue,
                        description: `Remove the ${title} title from this user`,
                        emoji: ':x:',
                    })
                    count ++
                });
                const row = new Discord.MessageActionRow()
                .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('TitleRemoveMenu')
                    .setPlaceholder('Choose Title to remove')
                    .setMaxValues(1)
                    .addOptions(titleList)
                )
                const embed = new Discord.MessageEmbed()
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
                        const embed = new Discord.MessageEmbed()
                        .setDescription(`${userVar.username} has the following titles:\n\n **${titlesString}**`)
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