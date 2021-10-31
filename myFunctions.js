module.exports = {
    ConfigToArrayOS: function (configStringPar){
        const OS = process.platform
        if(OS === 'win32'){
            return configStringPar.split('\r\n')
            }else if(OS === 'linux'){
                return configStringPar.split('\n')
            }
    }
}