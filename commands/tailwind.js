module.exports = {
    name: 'tailwind',
    aliases: ['tw'],
    args: true,
    required: [
        'airport ICAO',
        'a runway'
    ],
    usage: '`jo tw <ICAO> <RWY>`',
    description: 'Calculates the tailwind component for a runway.',
    execute (message, args) {
        
    }
}