const { Client, MessageEmbed } = require('discord.js');
const config = require('./config');
const commands = require('./help');
const handleMessage = require('./messages');

const createTempChannelChecker = require('./helpers/createTempChannelChecker');

let client = new Client({
  presence: {
    status: 'online',
    activity: {
      name: `${config.prefix}help`,
      type: 'LISTENING'
    }
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
  
    // handle temp channels
    client.guilds.cache.forEach(guild=>{
         guild.channels.cache.forEach(channel=>{
            if(channel.parent&&channel.parent.name=="Temp Channels"){
                createTempChannelChecker(channel);
            }
        })
    }) 
})

client.on('message', async message => {
    handleMessage({client,message});
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.partial){
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
			return;
        }
    }

    if(reaction.message.content=="React to this message to create an afk channel under temp channels!"){
        client.guilds.cache.forEach(guild=>{
            let category = guild.channels.cache.find(c => c.name == "Temp Channels" && c.type == "category");
            guild.channels.create("afk", {type: 'voice', reason: 'added a temp voice channel'})
                .then(channel=>{                
                    channel.setParent(category.id)
                    let interval = setInterval(()=>{
                        if(channel.members.size==0){
                            channel.delete();
                            clearInterval(interval)
                        }
                    },60000);
                })
                .catch(console.error)
        })
    }
})

require('./server')();
client.login(config.token);