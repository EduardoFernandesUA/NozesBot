const config = require('../config');

module.exports = async ({client,message}) => {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();

    if(!message.author.id=="351506093387677706") return;

    let messages = await message.channel.messages.fetch({limit:parseInt(args[0])+1})
    //console.log(messages);
    message.channel.bulkDelete(parseInt(args[0])+1,true).catch(error => console.log(error.stack));
}