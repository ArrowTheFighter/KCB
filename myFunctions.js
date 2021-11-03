module.exports = {
    ConfigToArrayOS: function (configStringPar){
        const OS = process.platform
        if(OS === 'win32'){
            return configStringPar.split('\r\n')
            }else if(OS === 'linux'){
                return configStringPar.split('\n')
            }
    },

    CheckConfigRoles: function (Inter, ConfigStr){
        const { guild } = Inter
        const member = guild?.members.cache.get(Inter.user.id)
        const userRoles = member?.roles.cache.map(role => role)
        configArray = this.ConfigToArrayOS(ConfigStr)
        let hasRole = false
        userRoles.forEach(role => {
            configArray.forEach(roleID =>{
                
                if (role.id === roleID){
                    hasRole = true
                }
            })
        });

        return hasRole
    }
}