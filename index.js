const Discord = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const client = new Discord.Client();
const prefix = 'jo ';

// Logging with timestamps!
console.logCopy = console.log.bind(console);
console.log = function (data) {
    var timestamp = `[${new Date().toISOString()}]: `;
    this.logCopy(timestamp, data);
};

// Jordanian Aviators related consts
const ga3deh = '550701545910566924';
const greetings = [
    'Ya hala wallah',
    'Ya mar7aba',
    'Welcome 3ammi',
    'Welcome habibi',
    'Welcome to the server'
]

dotenv.config();

client.once('ready', () => {
    console.log('JO Bot is ready!');
    client.user.setActivity('128.500 MHz', { type: 'LISTENING' })
    let guildCount = 0;
    client.guilds.cache.forEach(guild => {
        guildCount++;
        console.log(`- ${guild}.`);
    });
    console.log(`JO Bot is in ${guildCount} servers.`);
});

// Retrieving and setting up commands dynamically
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Send greetings to new members
client.on('guildMemberAdd', (member) => {
    let channel = member.guild.channels.cache.find(channel => channel.id === ga3deh);
    if (channel) {
        channel.send(`${greetings[Math.floor(Math.random() * greetings.length)]} ${member.nickname}!`);
    }
    console.log(`${member.id} joined ${member.guild.name}.`);
});

// Parsing commands
client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.mentions.has(client.user)) {
        message.channel.send(`My prefix is \`${prefix}\``);
        return;
    }
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))) return;

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.args && !args.length) {
        return message.reply(`Umm, you haven't provided me with ${command.required.join(' and ')}!`);
    }

    try {
        command.execute(commandName, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('sorry! Something went wrong trying to execute your command.');
    }
});

client.login(process.env.TOKEN);