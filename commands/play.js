const Discord = require('discord.js');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const moment = require('moment');
const queue = new Map();
const avatarURL = 'https://cdn.discordapp.com/avatars';

module.exports = {
    name: 'play',
    aliases: ['p', 'skip', 's', 'stop', 'leave', 'queue', 'q'],
    cooldown: 0,
    args: false,
    required: [
        'YouTube link'
    ],
    usage: '`jo play <link>`',
    description: 'Plays some music for ya.',
    async execute(commandName, message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('Y\'all know ye need to be in a voice channel first, right?');

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('Ye ain\'t got nuff power, kid. Heh.');
        if (!permissions.has('SPEAK')) return message.channel.send('Ye ain\'t got nuff power, kid. Heh.');

        const serverQueue = queue.get(message.guild.id);

        if (commandName === 'play' || commandName === 'p') {
            if (!args.length) return message.channel.send('Yo, send me something to lookup!');
            let songs = {};
            if (ytdl.validateURL(args[0])) {
                const info = await ytdl.getInfo(args[0]);
                song = { title: info.videoDetails.title, url: info.videoDetails.video_url, length: +info.videoDetails.lengthSeconds }
            }
            else {
                const videoFinder = async (query) => {
                    const result = await ytSearch(query);
                    return (result.videos.length > 1) ? result.videos[0] : null;
                }
                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url, length: video.seconds }
                    param = video.url;
                    thingy = video.title;
                }
                else return message.channel.send('Couldn\'t find that bro, sorry.');
            }
            if (!serverQueue) {
                const qConstructor = {
                    voiceChannel: channel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
                queue.set(message.guild.id, qConstructor);
                qConstructor.songs.push(song);

                try {
                    const connection = await channel.join();
                    qConstructor.connection = connection;
                    videoPlayer(message.guild, qConstructor.songs[0]);
                }
                catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('Something wrong happened..');
                    throw err;
                }
            }
            else {
                const index = serverQueue.songs.push(song);
                return message.channel.send(`**${song.title}** has been added to the queue in position ${index} :notes:`);
            }
        }

        else if (commandName === 'skip' || commandName === 's') skipSong(message, serverQueue);
        else if (commandName === 'stop' || commandName === 'leave') stopSong(message, serverQueue);
        else if (commandName === 'queue' || commandName === 'q') printQueue(message, serverQueue);
        else {
            console.log('Somebody be calling me weird names!');
            return;
        }
    }
}

/**
 * Plays songs in current guild's playlist.
 * @param {Discord.Guild} guild Current Guild
 * @param {Song} song Next song to be played.
 * @returns *null*
 */
const videoPlayer = async (guild, song) => {
    const songQ = queue.get(guild.id);

    if (!song) {
        songQ.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    songQ.connection.play(stream, { seek: 0, volume: 1 })
        .on('finish', () => {
            songQ.songs.shift();
            videoPlayer(guild, songQ.songs[0]);
        });
    await songQ.textChannel.send(`Now playing **${song.title}** :notes:`);
}

/**
 * Ends the current stream played. This will trigger the `.on('finish')` event in `videoPlayer` method.
 * @param {Discord.Message} message Current message object passed to command.
 * @param {Map} serverQ The current server's song queue.
 * @returns None
 */
const skipSong = (message, serverQ) => {
    if (!message.member.voice.channel) return message.channel.send('Ye kidding me, right?');
    if (!serverQ) {
        return message.channel.send('Ain\'t no songs in dis queue!');
    }
    serverQ.connection?.dispatcher?.end();
}

/**
 * Emptys current server's song queue and disconnects from the voice channel.
 * @param {Discord.Message} message Current message object passed to command.
 * @param {Map} serverQ The current server's song queue.
 * @returns None
 */
const stopSong = (message, serverQ) => {
    if (!message.member.voice.channel) return message.channel.send('Ye kidding me, right?');
    serverQ.songs = [];
    serverQ.connection?.dispatcher?.end();
}

/**
 * Displays the songs in the current server's queue.
 * @param {Discord.Message} message Current message object passed to command.
 * @param {Map} serverQ The current server's song queue.
 * @returns None
 */
const printQueue = (message, serverQ) => {
    if (!message.member.voice.channel) return message.channel.send('Ye kidding me, right?');
    let msg = '';
    serverQ.songs.forEach((song, index) => {
        msg += `${index + 1}. [${song.title}](${song.url}) - **[${moment.utc(song.length * 1000).format('HH:mm:ss')}]**\n`
    });
    let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`Queue for ${message.guild.name}`)
        .setTimestamp(new Date().toISOString())
        .setFooter(`${serverQ.songs.length} songs in queue | ${moment.utc(serverQ.songs.reduce((total, song) => { return total + song.length }, 0) * 1000).format('HH:mm:ss')} total time.`, `${avatarURL}/${message.member.user.id}/${message.member.user.avatar}`)
        .addField('__Queue__', msg);
    message.channel.send(embed);
}