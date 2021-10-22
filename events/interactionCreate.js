const DiscordJS = require('discord.js')

module.exports  =  {
    name: 'interactionCreate',
    once: false,
    execute(interaction) {
        if(interaction.isSelectMenu()){
            console.log(interaction.values[0])
            const { guild } = interaction
            if (interaction.customId === 'ColorMenu'){
                
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
            }
        
    }
}}