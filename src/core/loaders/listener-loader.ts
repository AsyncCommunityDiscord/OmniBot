import { type Client } from "discord.js";
import coreModule from "../core.module.js";

/**
 * Loads global commands from the core registry and registers them with Discord.
 *
 * @param client The Discord client instance used to register the commands.
 */
export function loadGlobalEvents(client: Client) {
  const coreListeners = coreModule.registry.listeners;

  for (let listener of coreListeners) {
    client.on(listener.eventType, listener.execute);
  }
}
