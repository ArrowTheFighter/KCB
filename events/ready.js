const WOKCommands = require('wokcommands')
const path = require('path')
module.exports = {
    name: 'ready',
    once: true,
    execute (client){
        new WOKCommands(client, {
            // The name of the local folder for your command files
            commandsDir: path.join(__dirname, '../commands'),
            
            testServers: '890788807694225460',
          })
          
        
          console.log('bot is ready')
    },
}