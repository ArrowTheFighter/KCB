const DiscordJS = require('discord.js');
const profileModel = require('../models/profileSchema')
const titlesModel = require('../models/titlesSchema')

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute (interaction, client){
        if(interaction.isSelectMenu()){
            const { guild } = interaction
            let embed
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
                    console.log(splitValue)

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
                    embed = new DiscordJS.MessageEmbed()
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
                    embed = new DiscordJS.MessageEmbed()
                    .setDescription(`**${interaction.user.username}** has removed the **${interaction.values[0]}** title from the database`)
                    .setColor("BLUE")

                    interaction.update({embeds: [embed], components: []})
                break;
                case 'TitleGiveMenu':
                    splitValue = interaction.values[0].split(',')
                    console.log(splitValue)

                    profileData = await profileModel.findOne({userID: splitValue[1] });

                    await profileModel.findOneAndUpdate({
                        userID: splitValue[1],
                    },{
                        $push:{
                            titles: splitValue[0],
                        }
                    })
                    user = interaction.client.users.cache.find(user => user.id === splitValue[1])
                    embed = new DiscordJS.MessageEmbed()
                    .setDescription(`**${interaction.member.user.username}** has given the **${splitValue[0]}** title to **${user.username}**`)
                    .setColor("BLUE")

                    interaction.update({embeds: [embed], components: []})
                break;
        }
        
    }
}}