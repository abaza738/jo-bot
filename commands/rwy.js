module.exports = {
    name: 'rwy',
    aliases: ['runway', 'active', 'activerunway'],
    args: true,
    required: [
        'airport ICAO'
    ],
    usage: '`jo rwy <ICAO>`',
    description: 'Guess the active runway based on wind.',
    execute (message, args) {

    }
}