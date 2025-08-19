import {
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { modules } from "../../index.js";
import { declareEventListener } from "../../lib/listener.js";
import logger from "../../lib/logger.js";
import coreModule from "../core.module.js";
import moduleService from "../services/module.service.js";

async function handleCommand(interaction: ChatInputCommandInteraction) {
  const command = [...modules, coreModule]
    .flatMap((module) =>
      module.registry.commands.map((cmd) => ({
        module: module,
        command: cmd,
      }))
    )
    .find((cmd) => cmd.command.data.name === interaction.commandName);

  if (!command) {
    logger.warn(`Command not found | name = ${interaction.commandName}`);
    return;
  }
  logger.debug(
    `Command found | name = ${command.command.data.name} | module = ${command.module.id}`
  );

  if (
    command.module.id === coreModule.id ||
    (
      await moduleService.getModuleStateIn(
        command.module.id,
        interaction.guild!
      )
    ).activated
  ) {
    logger.debug(`Executing command | name = ${interaction.commandName}`);
    await command.command.execute(interaction);
  } else {
    logger.warn(
      `Command not enabled | name = ${interaction.command?.name} | module = ${command.module.id}`
    );
    await interaction.reply({
      content: `The command \`${interaction.commandName}\` is not enabled in this guild.`,
      flags: MessageFlags.Ephemeral,
    });
  }
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
