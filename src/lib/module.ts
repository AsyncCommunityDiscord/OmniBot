import type { Guild } from "discord.js";
import type { Declared } from "./declared.js";

/**
 * Represents a module in the system.
 * A module is a self-contained unit of functionality that can be installed and uninstalled in a guild.
 */
export interface Module {
  /**
   * Unique identifier for the module.
   */
  id: string;

  /**
   * Name of the module.
   */
  name: string;

  /**
   * Description of the module.
   */
  description: string;

  /**
   * Version of the module.
   */
  version: string;

  /**
   * Optional author of the module.
   */
  author?: string;

  /**
   * Called when the module is initialized at startup.
   */
  init: () => void;

  /**
   * Called when the module is destroyed at shutdown.
   */
  destroy: () => void;

  /**
   * Called when the module is installed in a guild.
   * @param guild The guild where the module is being installed.
   */
  install: (guild: Guild) => void;

  /**
   * Called when the module is uninstalled from a guild.
   * @param guild The guild from which the module is being uninstalled.
   */
  uninstall: (guild: Guild) => void;
}

/**
 * Defines a module with the required properties and methods.
 * @param module The module definition to declare.
 */
export function defineModule(module: Module): Declared<Module> {
  return {
    type: "module",
    ...module,
  };
}
