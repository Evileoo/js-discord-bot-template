import {  } from 'discord.js';

export const autocomplete = {
    async execute(interaction){
        interaction.reply({
            content: "How did you get here ?",
            ephemeral: true
        });
    }
}