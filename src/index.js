import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';

// Create client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// Create commands collection
client.commands = new Collection();
const commands = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
for(let command of commands){
    const commandFile = await import(`./commands/${command}`);
    client.commands.set(commandFile.command.data.name, commandFile.command);
}

// Create buttons collection
client.buttons = new Collection();
const buttons = fs.readdirSync("./src/buttons").filter(file => file.endsWith(".js"));
for(let button of buttons){
    const buttonFile = await import(`./buttons/${button}`);
    client.buttons.set(button.split(".")[0], buttonFile.button);
}

// Read events
const events = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
for(let event of events){
    const eventFile = await import(`./events/${event}`);
    if(eventFile.event.once){
        client.once(eventFile.event.name, (...args) => {
            eventFile.event.execute(...args);
        });
    } else {
        client.on(eventFile.event.name, (...args) => {
            eventFile.event.execute(...args);
        });
    }
}

// Login
await client.login(process.env.TOKEN);