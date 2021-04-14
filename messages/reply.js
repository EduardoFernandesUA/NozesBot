const config = require('../config');

module.exports = async ({client,message}) => {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();

    if(!message.author.id=="351506093387677706") return;

    message.delete()
    message.channel.send(args.join(" "))
}