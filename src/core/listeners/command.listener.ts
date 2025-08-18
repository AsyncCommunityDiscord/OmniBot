import type { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { declareEventListener } from "../../lib/listener.js";
import coreRegistry from "../core-registry.js";

async function handleCommand(interaction: CommandInteraction) {
  const command = coreRegistry.commands.find(
    (cmd) => cmd.data.name === interaction.commandName
  );
  if (!command) {
    console.warn(`Command not found: ${interaction.commandName}`);
    return;
  }

  console.log(`Executing command: ${interaction.commandName}`);
  await command.execute(interaction);
}

async function handleComplete(interaction: AutocompleteInteraction) {
  const command = coreRegistry.commands.find(
    (cmd) => cmd.data.name === interaction.commandName
  );
  if (!command) {
    console.warn(
      `Command not found for autocomplete: ${interaction.commandName}`
    );
    return;
  }

  console.log(`Handling autocomplete for command: ${interaction.commandName}`);
  await command.complete?.(interaction);
}

export default declareEventListener({
  eventType: "interactionCreate",
  execute: async (interaction) => {
    if (interaction.isCommand()) {
      await handleCommand(interaction);
    }

    if (interaction.isAutocomplete()) {
      await handleComplete(interaction);
    }
  },
});
