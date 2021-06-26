const Discord = require("discord.js");

module.exports = {
    name: 'help',
    aliases: ['h', 'helpme'],
    args: false,
    usage: '`jo help [?optional <command name>]`',
    description: 'List available commands.',
    execute (message, args) {
        let data = '```';
        const { commands } = message.client;
        Array.from(commands).forEach((command, index) => {
            data += `${index+1}. ${command[1].name.padEnd(10, ' ')}${command[1].description}\n`;
        });

        if (!args.length) {
            const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('JO Bot Help')
            .setFooter('For bug reports, suggestions, or complaints, please proceed DCT QTR.')
            .setTimestamp(new Date().toUTCString())
            .addField('Commands', data+'```'.replace(/^\s*$(?:\r\n?|\n)/gm, ''));

            message.channel.send(embed);
        }
    }
}