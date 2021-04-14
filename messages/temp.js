const Database = require("@replit/database");
const config = require('../config');
const createTempChannelChecker = require("../helpers/createTempChannelChecker");

module.exports = async ({ client, message }) => {
  let args = message.content.slice(config.prefix.length).split(' ');
  let command = args.shift().toLowerCase();

  let guild = client.guilds.cache.find(g => g.id == "402798509096566794");
  let category = guild.channels.cache.find(c => c.name == "Temp Channels" && c.type == "category");

  const db = new Database();

  if (args.length==1&&args[0]) {
    db.list("temp_").then(matches => {
      matches.forEach(key => {
        db.get(key).then(value => {
          if (value == args[0].replace(/[^a-zA-Z0-9 ]/g, "")) {
            let channel = guild.channels.cache.find(channel => channel.name == key.slice(5))
            channel.updateOverwrite(message.author, { VIEW_CHANNEL: true, CONNECT: true });
          }
        })
      })
    })
    return;
  }

  if(args.length==2){
    console.log(args);
    let m = await message.author.send("Creating Channel...");
    if(args[1]=="n"||args[1]=="N"){
      if(guild.channels.cache.find(c=>c.name==args[0])){
        message.author.send("Name alredy in use");
      }else{
        await createChannel(guild,category,message,args[0]);
        await message.author.send("Channel Created!");
      }
    }
    return;
  }

  let m1 = await message.author.send("Channel Setup!");

  let channelName;
  while(true){
    channelName = await askName(message, m1);
    if (channelName == "stop" || channelName == "cancel") return;
    if(guild.channels.cache.find(c=>c.name==channelName)){
      m1.channel.send("Name alredy in use");
    }else{
      break;
    }
  }
  let privateChannel = await askPrivate(message, m1);
  if (privateChannel == "stop" || privateChannel == "cancel") return;
  if (privateChannel) {
    let pass = await askPassword(message, m1);
    if (pass == "stop" || pass == "cancel") return;
    db.set(`temp_${channelName}`, pass)
    await createPrivateChannel(guild, category, message, channelName, pass);
  } else {
    await createChannel(guild, category, message, channelName);
  }
  m1.channel.send("Channel Created!");

}

const askName = (message, m1) => {
  return new Promise((resolve, reject) => {
    m1.channel.send("Channel Name?");
    m1.channel.awaitMessages(m => m.author.id === message.author.id, {
      max: 1,
      time: 120000,
      errors: ['time']
    })
      .then(m2 => {
        m2 = m2.first();
        resolve(m2.content.replace(/[^a-zA-Z0-9 ]/g, ""));
      })
      .catch(collected => {
        message.channel.send('Timeout');
      });
  })
}

const askPrivate = (message, m1) => {
  return new Promise((resolve, reject) => {
    m1.channel.send("Private Channel? (Y/N)");
    m1.channel.awaitMessages(m => m.author.id === message.author.id, {
      max: 1,
      time: 120000,
      errors: ['time']
    })
      .then(m2 => {
        m2 = m2.first();
        resolve(m2.content.toLowerCase() == "y" || m2.content.toLowerCase() == "yes");
      })
      .catch(collected => {
        message.channel.send('Timeout');
      });
  })
}

const askPassword = (message, m1) => {
  return new Promise((resolve, reject) => {
    m1.channel.send("Channel Password?");
    m1.channel.awaitMessages(m => m.author.id === message.author.id, {
      max: 1,
      time: 120000,
      errors: ['time']
    })
      .then(m2 => {
        m2 = m2.first();
        resolve(m2.content.replace(/[^a-zA-Z0-9 ]/g, ""));
      })
      .catch(collected => {
        message.channel.send('Timeout');
      });
  })
}

const createChannel = (guild, category, message, channelName) => {
  return new Promise((resolve, reject) => {
    guild.channels.create(channelName,
      {
        type: 'voice', reason: 'added a temp voice channel'
      })
      .then(channel => {
        channel.setParent(category.id);
        createTempChannelChecker(channel);
        resolve()
      })
      .catch(console.error)
  })
}

const createPrivateChannel = async (guild, category, message, channelName) => {
  //let newRole = await guild.roles.create({ data: { name: "temp "+channelName}});0
  return new Promise((resolve, reject) => {
    guild.channels.create(channelName,
      {
        type: 'voice', 
        reason: 'added a temp voice channel'
      })
      .then(channel => {
        channel.setParent(category.id);
        createTempChannelChecker(channel);
        channel.overwritePermissions([
          {
            id: guild.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: message.author.id,
            allow: ['VIEW_CHANNEL'],
          },
        ]);
        resolve()
      })
      .catch(console.error)
  })
}



/*


*/