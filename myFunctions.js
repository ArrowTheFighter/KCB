const fs = require('fs')
module.exports = {
    ConfigToArrayOS: function (configStringPar){
        const OS = process.platform
        if(OS === 'win32'){
            return configStringPar.split('\r\n')
            }else if(OS === 'linux'){
                return configStringPar.split('\n')
            }
    },

    CheckConfigRoles: function (Inter, ConfigArr){
        const { guild } = Inter
        const member = guild?.members.cache.get(Inter.user.id)
        const userRoles = member?.roles.cache.map(role => role)
        let hasRole = false
        const configJson = fs.readFileSync('./configs/overrideConfig.txt', {encoding:'utf8', flag:'r'})
        const configArray = JSON.parse(configJson)
        userRoles.forEach(role =>{
            configArray.forEach(configRole =>{
                if (role.id === configRole){
                    return hasRole = true
                }
            })
        })
        if(ConfigArr.length === 0){
            hasRole = true
            return hasRole
        }
        userRoles.forEach(role => {
            ConfigArr.forEach(roleID =>{
                
                if (role.id === roleID){
                    hasRole = true
                }
            })
        });

        return hasRole
    }
}