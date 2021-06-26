module.exports = {
    name: 'metar',
    aliases: ['wx', 'weather', 'atis'],
    args: true,
    required: [
        'airport ICAO'
    ],
    usage: '`jo metar <ICAO>`',
    description: 'Retrieve and parse the METAR of airport.',
    execute(message, airport) {
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