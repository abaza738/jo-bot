const Discord = require('discord.js');
const fetch = require('node-fetch');
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
    client.user.setActivity('to 128.500 MHz', { type: 'LISTENING' })
    let guildCount = 0;
    client.guilds.cache.forEach(guild => {
        guildCount++;
        console.log(`- ${guild}.`);
    });
    console.log(`JO Bot is in ${guildCount} servers.`);
});

client.on('guildMemberAdd', (member) => {
    let channel = member.guild.channels.cache.find(channel => channel.id === ga3deh);
    if (channel) {
        channel.send(`${greetings[Math.floor(Math.random() * greetings.length)]} ${member.nickname}!`);
    }
    console.log(`${member.id} joined ${member.guild.name}.`);
});

client.on('message', (message) => {
    if (message.author == client.user) {
        return;
    }

    if (!message.content.toLowerCase().startsWith(prefix, 0)) {
        return;
    }
    else {
        let pieces = message.content.split(' ');
        let command = pieces[1];
        let args = pieces[2].trim();
        if (!command) return;
        switch (command) {
            case 'metar':
                console.log(`Called ${command} command.`);
                metar(message, args);
                break;

            case 'help':
                console.log(`Called ${command} command.`);
                break;

            case 'rwy':
                console.log(`Called ${command} command.`);
                break;

            case 'tw':
                console.log(`Called ${command} command.`);
                break;

            default:
                console.log(`${command}: Not a known command.`);
                break;
        }
    }
})

function help(arg = null) {

}

function metar(message, airport) {
    if (airport.length != 4) return;
    let url = `https://avwx.rest/api/metar/${airport}`;
    fetch(url, {
        headers: {
            Authorization: process.env.AVWX_TOKEN
        }
    })
        .then(data => data.json())
        .then(metar => {
            let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${airport.toUpperCase()} METAR`)
            .setTimestamp(new Date().toISOString())
            .setFooter('Data retrieved from AVWX API', 'https://avwx.rest/')
            .addField('Decoded', `
                Report time: ${new Date(metar.time.dt).toUTCString()}
                Wind speed ${metar.wind_speed.value} ${metar.units.wind_speed} from H${metar.wind_direction.repr} ${metar.wind_variable_direction.length ? 'variable between ' + metar.wind_variable_direction[0].repr + ' and ' + metar.wind_variable_direction[1].repr + ' degrees' : ''} ${metar.wind_gust ? 'gusting at '+metar.wind_gust+' '+metar.units.wind_speed : ''}  
                ${metar.visibility ? 'Visibility ' + metar.visibility.repr + metar.units.visibility : '\r'}
                ${metar.wx_codes.length ? metar.wx_codes.map(code=>code.value).join(', ') : '\r'}
                ${metar.clouds.length ? 'Clouds ' + metar.clouds.map(c=>c.type + ' at ' + (c.altitude * 100) + metar.units.altitude + (metar.clouds.modifier ? ' type '+metar.clouds.modifier : '')).join(', ') : '\r'}
                Temparature ${metar.temperature.value} ${metar.units.temperature.toUpperCase()}
                Pressure ${metar.altimeter.value} ${metar.units.altimeter}
            `.replace(/^\s*$(?:\r\n?|\n)/gm, ''))
            .addField('Raw', `\`\`\`\n${metar.raw}\`\`\``);
            message.channel.send(embed);
        })
        .catch(reason => {
            console.log(reason);
        });
}

function rwy(airport) {

}

function tailwind(airport, runway) {

}

client.login(process.env.TOKEN);