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

async function getRunways(icao) {
    const url = `https://avwx.rest/api/station/${icao}`;
    let data = await get(url);
    return data.runways ? data.runways : -1;
}

module.exports = {
    name: 'rwy',
    aliases: ['runway', 'active', 'activerunway', 'pref', 'prefrwy'],
    args: true,
    required: [
        'airport ICAO'
    ],
    usage: '`jo rwy <ICAO>`',
    description: 'Guess the active runway based on wind.',
    async execute (commandName, message, args) {
        let icao = args[0];
        let pref = [];
        if(icao.length != 4) { message.channel.send('That\'s not an ICAO airport.'); return; }

        let runways = await getRunways(icao);
        if (runways == -1) { message.channel.send(`Couldn't get runway information for ${icao.toUpperCase()}.`); return; }

        const metar = await get(`https://avwx.rest/api/metar/${icao}`);
        let wind_direction = metar.wind_direction.value;
        if (metar.wind_speed.value < 5) { message.channel.send('Seems like wind is calm. No preferred runway.'); return; };

        // Here goes the actual logic..

        for (runway of runways) {
            let RWY_HDG = [runway.bearing1, runway.bearing2];
            for (let i = 0; i < 2; i++) {
                let left = (RWY_HDG[i]-80)%360 < 0 ? ((RWY_HDG[i]-80)%360) + 360 : (RWY_HDG[i]-80)%360;
                let right = (RWY_HDG[i]+80)%360;
                if((wind_direction >= left && wind_direction <= right) && left <= right)
                    pref.push(runway[`ident${i+1}`]);
                else if((wind_direction >= left || wind_direction <= right) && left > right)
                    pref.push(runway[`ident${i+1}`]);
            }
        }
        if (pref.length) {
            let embed = new Discord.MessageEmbed()
            .setTitle(`Active Runway(s) [${icao.toUpperCase()}]`)
            .setColor('RANDOM')
            .setTimestamp(new Date().toUTCString())
            .setFooter('Note: calculation does not take into account local SOP')
            .addField('Wind favour the following runway(s):', `**${pref.sort().join(', ')}**.`);
            message.channel.send(embed);
            return;
        }
        else {
            message.channel.send('Either there\'s a straight crosswind, or I can\'t get it done.');
            console.log(metar.raw);
            console.log(runways);
        }
    }
}