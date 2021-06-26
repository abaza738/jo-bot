const Discord = require('discord.js');
const fetch = require('node-fetch');

async function get(url, options) {
    const response = await fetch(url, {
        headers: {
            Authorization: process.env.AVWX_TOKEN
        }
    });
    const data = await response.json();
    return data;
}

module.exports = {
    name: 'metar',
    aliases: ['wx', 'weather', 'atis'],
    args: true,
    required: [
        'airport ICAO'
    ],
    usage: '`jo metar <ICAO>`',
    description: 'Retrieve and parse the METAR of airport.',
    async execute(message, args) {
        const airport = args[0];
        if (airport.length != 4) return;

        // Getting airport information
        let info_url = `https://avwx.rest/api/station/${airport}`;
        let airport_info = await get(info_url);

        // Getting airport weather
        let url = `https://avwx.rest/api/metar/${airport}`;
        await get(url)
            .then(metar => {
                let embed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle(`${airport.toUpperCase()} METAR`)
                    .setTimestamp(new Date().toISOString())
                    .setFooter('Data retrieved from AVWX API', 'https://avwx.rest/')
                    .addField(`${airport_info.name}`, `
                    Location: ${airport_info.city}, ${airport_info.country}
                    Elevation: ${airport_info.elevation_ft} ft. MSL`)
                    .addField('Decoded', `
                Report time: ${new Date(metar.time.dt).toUTCString()}
                Wind speed ${metar.wind_speed.value} ${metar.units.wind_speed} from H${metar.wind_direction.repr} ${metar.wind_variable_direction.length ? 'variable between ' + metar.wind_variable_direction[0].repr + ' and ' + metar.wind_variable_direction[1].repr + ' degrees' : ''} ${metar.wind_gust ? 'gusting at ' + metar.wind_gust + ' ' + metar.units.wind_speed : ''}  
                ${metar.visibility ? 'Visibility ' + metar.visibility.repr + metar.units.visibility : '\r'}
                ${metar.wx_codes.length ? metar.wx_codes.map(code => code.value).join(', ') : '\r'}
                ${metar.clouds.length ? 'Clouds ' + metar.clouds.map(c => c.type + ' at ' + (c.altitude * 100) + metar.units.altitude + (metar.clouds.modifier ? ' type ' + metar.clouds.modifier : '')).join(', ') : '\r'}
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
}