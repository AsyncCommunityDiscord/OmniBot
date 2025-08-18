import { type Client, type Guild, REST, Routes } from "discord.js";
import type { Module } from "../../lib/module.js";
import coreModule from "../core.module.js";

/**
 * Loads global commands from the core registry and registers them with Discord.
 *
 * @param client The Discord client instance used to register the commands.
 */
export function loadGlobalCommands(client: Client) {
  const coreCommands = coreModule.registry.commands.map((command) =>
    command.data.toJSON()
  );

  const rest = new REST().setToken(client.token!);
  rest
    .put(Routes.applicationCommands(client.user!.id), {
      body: coreCommands,
    })
    .then(() => {
      console.log(
        `Successfully loaded commands from core registry | count = ${coreCommands.length}`
      );
    })
    .catch((error) => {
      console.error(`Failed to load commands | error = `, error);
    });
}

export async function installModuleCommandsIn(
  client: Client,
  module: Module,
  guild: Guild
) {
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

    console.log(
      `Successfully loaded commands for module "${module.id}" in guild "${guild.name}" | count = ${commands.length}`
    );
  } catch (error) {
    console.error(
      `Failed to load commands for module "${module.id}" in guild "${guild.name}" | error = `,
      error
    );
  }
}

export async function uninstallModuleCommandsIn(
  _: Client,
  module: Module,
  guild: Guild
) {
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

    console.log(
      `Successfully uninstalled commands for module "${module.id}" in guild "${guild.name}"`
    );
  } catch (error) {
    console.error(
      `Failed to uninstall commands for module "${module.id}" in guild "${guild.name}" | error = `,
      error
    );
  }
}
