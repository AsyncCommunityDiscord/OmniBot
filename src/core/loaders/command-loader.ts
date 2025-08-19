import { type Client, type Guild, REST, Routes } from "discord.js";
import logger from "../../lib/logger.js";
import type { Module } from "../../lib/module.js";
import coreModule from "../core.module.js";

/**
 * Loads global commands from the core registry and registers them with Discord.
 *
 * @param client The Discord client instance used to register the commands.
 */
export function loadGlobalCommands(client: Client) {
  logger.info("Loading global commands");

  const coreCommands = coreModule.registry.commands.map((command) =>
    command.data.toJSON()
  );

  const rest = new REST().setToken(client.token!);
  rest
    .put(Routes.applicationCommands(client.user!.id), {
      body: coreCommands,
    })
    .then(() => {
      logger.info(
        `Successfully loaded global commands | count = ${coreCommands.length}`
      );
    })
    .catch((error) => {
      logger.error(`Failed to load commands | error = ${error}`);
    });
}

export async function installModuleCommandsIn(
  client: Client,
  module: Module,
  guild: Guild
) {
  logger.info(
    `Installing module commands for "${module.id}" in guild "${guild.id}"`
  );

  const commands = module.registry.commands.map((command) =>
    command.data.toJSON()
  );

  const rest = new REST().setToken(client.token!);

  try {
    const createPromises = commands.map((command) =>
      rest.post(Routes.applicationGuildCommands(client.user!.id, guild.id), {
        body: command,
      })
    );

    await Promise.all(createPromises);

    logger.info(
      `Successfully loaded commands for module "${module.id}" in guild "${guild.id}" | count = ${commands.length}`
    );
  } catch (error) {
    logger.error(
      `Failed to load commands for module "${module.id}" in guild "${guild.id}" | error = `,
      error
    );
  }
}

export async function uninstallModuleCommandsIn(
  _: Client,
  module: Module,
  guild: Guild
) {
  logger.info(
    `Uninstalling module commands for "${module.id}" in guild "${guild.id}"`
  );

  try {
    const commands = await guild.commands.fetch();

    const moduleCommands = module.registry.commands.map((cmd) => cmd.data.name);
    const commandsToDelete = commands.filter((cmd) =>
      moduleCommands.includes(cmd.name)
    );

    const deletePromises = commandsToDelete.map((cmd) =>
      guild.commands.delete(cmd.id)
    );

    await Promise.all(deletePromises);

    logger.info(
      `Successfully uninstalled commands for module "${module.id}" in guild "${guild.id}"`
    );
  } catch (error) {
    logger.error(
      `Failed to uninstall commands for module "${module.id}" in guild "${guild.id}" | error = `,
      error
    );
  }
}
