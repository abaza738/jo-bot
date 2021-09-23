# Jordan Aviators Bot

A simple Discord bot using `Discord.js` for our aviation server.

## Description

The JO Bot serves members of the Jordanian Aviators Discord server. It includes useful commands for flight simulation enthusiasts such as getting the weather at a certain airport, knowing the active runway at a certain airport, or calculating the tailwind component for a certain runway.  
More commands can be added as we find more cases to cover. If you have any suggestions, please open a new issue with your requested command and expected behaviour of the command. Be as detailed as possible please!

## Available Commands

<table>
    <thead>
        <tr>
            <th align="center">Command</th>
            <th align="center">Arguments</th>
            <th align="center">Example</th>
            <th align="center">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="center" colspan=4><b>────────── General ──────────</b></td>
        </tr>
        <tr>
            <td><code>help</code></td>
            <td>None</td>
            <td><code>jo help</code></td>
            <td>Gets the list of commands.</td>
        </tr>
        <tr>
            <td ><code>help</code></td>
            <td ><code>&lt;command&gt;</code></td>
            <td ><code>jo help metar</code></td>
            <td >Sends a description of the command with helping tips and usage info.</td>
        </tr>
        <tr>
            <td align="center" colspan=4><b>────────── Aviation ──────────</b></td>
        </tr>
        <tr>
            <td ><code>metar</code></td>
            <td ><code>&lt;ICAO&gt;</code></td>
            <td ><code>jo metar OJAI</code></td>
            <td >Retrieves the weather information for the airport.</td>
        </tr>
        <tr>
            <td ><code>rwy</code></td>
            <td ><code>&lt;ICAO&gt;</code></td>
            <td ><code>jo rwy OJAI</code></td>
            <td >Gives an estimation of the active runway(s) at the airport.</td>
        </tr>
        <tr>
            <td ><code>tw</code></td>
            <td ><code>&lt;ICAO&gt;</code> <code>&lt;RWY&gt;</code></td>
            <td ><code>jo tw OJAI 26R</code></td>
            <td >Calculates the tailwind component for the specified runway.</td>
        </tr>
        <tr>
            <td align="center" colspan=4><b>────────── Music ──────────</b></td>
        </tr>
        <tr>
            <td ><code>play</code></td>
            <td ><code>&lt;query | url&gt;</code></td>
            <td ><code>jo play piano</code></td>
            <td>Searches and plays a YouTube video via a query or a URL.</td>
        </tr>
    </tbody>
</table>
