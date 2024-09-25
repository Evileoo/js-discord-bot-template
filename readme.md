# How to use

## dependencies

Just install last discord.js version (if it's still v14)

```
npm install discord.js
```

## .env file

First of all, make sur the `.gitignore` file contains a `.env` line, then write this :

```
TOKEN=yourBotToken
APPID=yourAppId
```

## deploy commands

```
npm run d
```

## start the bot

```
npm run i
```

# Easy example

## How to add a modal handling ?


First of all create a subfolder called `modals` inside the `src` folder and add a modal file, let's call it `example.js`


In `index.js`, add a code block that looks like the `buttons` one (just replace `button` by `modal`)

```javascript
// Create buttons collection
client.buttons = new Collection();
const buttons = fs.readdirSync("./src/buttons").filter(file => file.endsWith(".js"));
for(let button of buttons){
    const buttonFile = await import(`./buttons/${button}`);
    client.buttons.set(button.split(".")[0], buttonFile.button);
}

// Create modals collection
client.modals = new Collection();
const modals = fs.readdirSync("./src/modals").filter(file => file.endsWith(".js"));
for(let modal of modals){
    const modalFile = await import(`./modals/${modal}`);
    client.modals.set(modal.split(".")[0], modalFile.modal);
}
```

Now, you need to handle the `modal submit` event in `interactionCreate.js` before the `else`

```javascript
else if(interaction.isModalSubmit()) {
    // Get the modal from the collection created in index.js
    const modal = interaction.client.modals.get(interaction.customId);

    // Check if the modal file exists
    if(!modal) console.error(`No modal matching ${interaction.customId} was found.`);

    // Execute modal submit code
    try {
        await modal.execute(interaction);
    } catch(error) {
        console.error(`Error executing modal ${interaction.customId}`);
		console.error(error);
    }
}
```

Then create the modal in a command or context menu

**The custom ID must be the same as the modal file name**

```javascript
// Create the modal
const modal = new ModalBuilder()
.setCustomId("example")
.setTitle("Just a quick example");

// Create inputs
const input = new TextInputBuilder()
.setCustomId("didYouLikeIt")
.setLabel("Did you like it ?")
.setStyle(TextInputStyle.Short);

// Add inputs to a row
const row = new ActionRowBuilder()
.addComponents(input);

// Add rows to the modal
modal.addComponents(row);

// Display modal to the user
await interaction.showModal(modal);
```

Last step, define what will be done when your modal will be sent by coding the `example.js` file

```javascript
import {  } from 'discord.js';

export const modal = {
    async execute(interaction){
        // Get the user inputs
        const answer = interaction.fields.getTextInputValue("didYouLikeIt");
        // Build the message
        const message = `you answered *${answer}*`;

        // Reply to the user
        interaction.reply({
            content: message,
            ephemeral: true
        });
    }
}
```

*NOTE : I didn't test the code. Testing is doubting*