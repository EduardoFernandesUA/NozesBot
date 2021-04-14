const config = require('../config');
const Database = require("@replit/database")

module.exports = ({client,message,app}) => {
    if (message.content.startsWith(config.prefix)) {
        let command = message.content.slice(config.prefix.length).split(' ')[0];

        let fCmd;
        try{
            fCmd = require("./"+command)                
        }catch (e){
            console.log("not a command")
        } finally {
            if(fCmd) fCmd({client,message,app});
        }

        return;
    }    
}