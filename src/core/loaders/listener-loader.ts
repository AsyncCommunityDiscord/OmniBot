import { type Client } from "discord.js";
import { loggerMaker } from "../../lib/logger.js";
import type { Module } from "../../lib/module.js";
import coreModule from "../core.module.js";
import moduleService from "../services/module.service.js";

const logger = loggerMaker("listeners");

/**
 * Loads global listeners from the core registry and registers them with Discord.
 *
 * @param client The Discord client instance used to register the commands.
 */
export function loadGlobalEvents(client: Client) {
  const coreListeners = coreModule.registry.listeners;

  for (let listener of coreListeners) {
    client.on(listener.eventType, listener.execute);
  }
}

/**
 * Loads module-specific listeners from the core registry and registers them with Discord.
 */
export function loadModuleEvents(client: Client, module: Module) {
  const moduleListeners = module.registry.listeners;
  if (moduleListeners.length === 0) {
    logger.info(`No listeners found for module ${module.id}`);
    return;
  }

  logger.info(
    `Loading module listeners | module = ${module.id} | count = ${moduleListeners.length}`
  );

  for (let listener of moduleListeners) {
    logger.info(`\tRegistering listener | event = ${listener.eventType}`);

    client.on(listener.eventType, (...args) => {
      const guildId =
        args.find((arg) => !!arg.roles)?.id ||
        args.find((arg) => !!arg?.guild).guild?.id ||
        args.find((arg) => !!arg?.guildId);

      if (guildId) {
        moduleService
          .getModuleStateFromGuildIdIn(module.id, guildId)
          .then((state) => {
            if (!state.activated) return;

            listener.execute(...args).then();
          });
        return;
      }

      // If no guildId is found, execute the listener directly
      listener.execute(...args).then();
    });
  }

  logger.info(`Loaded module listeners | module = ${module.id}`);
}
