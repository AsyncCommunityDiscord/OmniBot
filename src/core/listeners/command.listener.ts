import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { declareEventListener } from "../../lib/listener.js";
import logger from "../../lib/logger.js";
import coreModule from "../core.module.js";

async function handleCommand(interaction: ChatInputCommandInteraction) {
  const command = coreModule.registry.commands.find(
    (cmd) => cmd.data.name === interaction.commandName
  );
  if (!command) {
    logger.warn(`Command not found | name = ${interaction.commandName}`);
    return;
  }

  logger.debug(`Executing command | name = ${interaction.commandName}`);
  await command.execute(interaction);
}

async function handleComplete(interaction: AutocompleteInteraction) {
  const command = coreModule.registry.commands.find(
    (cmd) => cmd.data.name === interaction.commandName
  );
  if (!command) {
    logger.warn(
      `Command not found for autocomplete | name = ${interaction.commandName}`
    );
    return;
  }

  logger.debug(`Handling autocomplete | name = ${interaction.commandName}`);
  await command.complete?.(interaction);
}

export default declareEventListener({
  eventType: "interactionCreate",
  execute: async (interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    }

    if (interaction.isAutocomplete()) {
      await handleComplete(interaction);
    }
  },
});
