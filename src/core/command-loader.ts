import { type Client, REST, Routes } from "discord.js";
import coreRegistry from "./core-registry.js";

/**
 * Loads global commands from the core registry and registers them with Discord.
 *
 * @param client The Discord client instance used to register the commands.
 */
export function loadGlobalCommands(client: Client) {
  const coreCommands = coreRegistry.commands.map((command) =>
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
