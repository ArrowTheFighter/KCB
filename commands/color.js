
const profileModel = require('../models/profileSchema');
const Discord = require('discord.js')
require('dotenv').config();


module.exports = {


    category: 'UserManagement',
    description: 'Change your color',
    
    slash: true,
    testOnly: true,

    callback: async ({ interaction, client }) => {
        
        let profileData;
            
            profileData = await profileModel.findOne({userID: interaction.member?.user.id });
            
                try{
                profileData = await profileModel.findOne({userID: interaction.member?.user.id });
                if(!profileData){
                    let profile = await profileModel.create({
                        userID: interaction.member?.user.id,
                        serverID: interaction.guild?.id,
                        endorsments: 0,
                        communityPoints: 0,
                    });
                    profile.save();
                }
            }catch(error){
                console.log(err);
        };
        profileData = await profileModel.findOne({userID: interaction.member?.user.id });
        const { guild } = interaction
        const member = guild?.members.cache.get(interaction.user.id)
        const roles = member?.roles.cache.map(role => role)
        let rolesArray = ['895500910116098108','895498268363092019','895498331764179015','895490104678821929','895490014388047954','895490060047253555']
        let curColorRole
        roles.every(role => {
            rolesArray.every(color =>{
                
                if(color === role.id){
                    curColorRole = role.id 
                    console.log('true')
                    return false
                }
                return true
            })
            return true
        })

        rolesArray.length=(rolesArray.indexOf(curColorRole) + 1)
        console.log(rolesArray.length)
        let otherRoles = ['900947603154436127']
        roles.forEach(role =>{
            otherRoles.forEach(other =>{
                if (role.id === other){
                    rolesArray.push(other)
                }
            })
        })
        
        
        let roleList = []



        rolesArray.forEach(role => {
            switch(role){
                case '895500910116098108':
                    // Villager Role
                    roleList.push({
                        label: 'Faded Green',
                        value: 'fadedGreen',
                        description: 'Switch your color to faded green',
                        emoji: '899853811944919060',
                        order: 1
                    })
                    break;
                case '895498268363092019':
                    //Adventurer Role
                    roleList.push({
                        label: 'Dark Green',
                        value: 'darkGreen',
                        description: 'Switch your color to dark green',
                        emoji: '899855566455840879',
                        order: 2
                    })
                    break;
                case '895498331764179015':
                    //Hero Role
                    roleList.push({
                        label: 'Light Green',
                        value: 'lightGreen',
                        description: 'Switch your color to light green',
                        emoji: '899855566829125654',
                        order: 3
                    })
                    break;
                case '895490104678821929':
                    //Champion Role
                    roleList.push({
                        label: 'Dark Purple',
                        value: 'darkPurple',
                        description: 'Switch your color to dark purple',
                        emoji: '899855566430691362',
                        order: 4
                    })
                    break;
                case '895490014388047954':
                    //Paladin Role
                    roleList.push({
                        label: 'Light Purple',
                        value: 'lightPurple',
                        description: 'Switch your color to light purple',
                        emoji: '899855567017902121',
                        order: 5
                    })
                    break;
                case '895490060047253555':
                    //Ancient Role
                    roleList.push({
                        label: 'Dark Pink',
                        value: 'darkPink',
                        description: 'Switch your color to dark pink',
                        emoji: '899855566770429953',
                        order: 6
                    })
                    break;
                case '900947603154436127':
                    //Competition Winnder Role
                    roleList.push({
                        label: 'Peach',
                        value: 'peach',
                        description: 'Switch your color to peach',
                        emoji: '900950426390777887',
                        order: 7
                    })
                    break;
            }
        });
        roleList.sort((a, b) => b.order - a.order);
        const date = new Date()
        const embed = new Discord.MessageEmbed()
        .setDescription(`Choose a new color`)
        .setColor("BLUE")
        
        if(roleList.length < 1){
            return interaction.reply({content: 'You need a colored role before you can use this command', ephemeral: true})
        }else{
            const row = new Discord.MessageActionRow()
            .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('ColorMenu')
                .setPlaceholder('Choose color')
                .setMaxValues(1)
                .addOptions(roleList)
            )
            interaction.reply({embeds: [embed], components: [row], ephemeral: true})
        }
        
        
        

        
        }
}