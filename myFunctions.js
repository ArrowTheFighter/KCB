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