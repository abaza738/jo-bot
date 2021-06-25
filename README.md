# Jordan Aviators Bot
A simple Discord bot using `Discord.js` for our aviation server.

## Description
The JO Bot serves members of the Jordanian Aviators Discord server. It includes useful commands for flight simulation enthusiasts such as getting the weather at a certain airport, knowing the active runway at a certain airport, or calculating the tailwind component for a certain runway.  
More commands can be added as we find more cases to cover. If you have any suggestions, please open a new issue with your requested command and expected behaviour of the command. Be as detailed as possible please!

## Available Commands
| Command | Arguments | Example | Description |
| :-- | :---: | :-- | :-- |
| `help` | None | `jo help` | Gets the list of commands. |
| `help` | `<command>` | `jo help metar` | Sends a description of the command with helping tips and usage info. |
| `metar` | `<ICAO>` | `jo metar OJAI` | Retrieves the weather information for the airport. |
| `rwy` | `<ICAO>` | `jo rwy OJAI` | Gives an estimation of the active runway(s) at the airport. |
| `tw` | `<ICAO>` `<RWY>` | `jo tw OJAI 26R` | Calculates the tailwind component for the specified runway.