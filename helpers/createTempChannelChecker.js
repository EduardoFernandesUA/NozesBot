const config = require('../config');
const Database = require("@replit/database");

module.exports = (channel) => {
    if(channel.type=="voice"){
        let interval = setInterval(()=>{
            if(channel.members.size==0){
                const db = new Database();
                db.get("temp_"+channel.name).then(i=>{
                  db.delete("temp_"+channel.name).then(() => {
                    console.log("key deleted!")
                  });

                })
                channel.delete();
                clearInterval(interval);
            }
        },config.tempVoiceTime)
    }
}