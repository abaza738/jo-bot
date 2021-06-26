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
            .addField('Commands', data+'```'.replace(/^\s*$(?:\r\n?|\n)/gm, ''))
            .addField('Details', 'For details about a specific command, type `jo help <command>`.');

            message.channel.send(embed);
        }
        else {
            const commandName = args[0] ? args[0] : null;
            const command = commands.get(commandName);
            if (!command) return;

            const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Help for ${command.name.toUpperCase()}`)
            .setFooter('To see the full list of commands, type `jo help`.')
            .setTimestamp(new Date().toUTCString())
            .addField('Usage', command.usage)
            .addField('Other aliases', command.aliases.map(c => `\`${c}\``).join(', '))
            .addField('Description', command.description);

            message.channel.send(embed);
        }
    }
}