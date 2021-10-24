const WOKCommands = require('wokcommands')
const path = require('path')
module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message) {
        if(message.channel.type == "DM"){
            //direct message here
            const messageContent = message.content.toLowerCase()
            if(messageContent === 'password'){
                message.channel.send('this is the password')
            }
        }
        //console.log(message.channel.type)
    },
}