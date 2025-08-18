import { type Client, GatewayIntentBits, type Guild } from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";
import { Registry } from "./registry.js";

export interface ModuleDeclaration {
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
   * Intents that the module requires.
   */
  intents?: GatewayIntentBits[];

  /**
   * Called when the module is initialized at startup.
   *
   * @param client The Discord client instance.
   */
  onLoad: (client: Client, registry: Registry) => void;

  /**
   * Called when the module is installed in a guild.
   *
   * @param client The Discord client instance.
   * @param guild The guild where the module is being installed.
   */
  onInstall: (client: Client, guild: Guild, registry: Registry) => void;

  /**
   * Called when the module is uninstalled from a guild.
   *
   * @param client The Discord client instance.
   * @param guild The guild from which the module is being uninstalled.
   */
  onUninstall: (client: Client, guild: Guild, registry: Registry) => void;
}

/**
 * Represents a module in the system.
 * A module is a self-contained unit of functionality that can be installed and uninstalled in a guild.
 */
export interface Module extends ModuleDeclaration {
  /**
   * Registry for commands and other declarations made by the module.
   */
  registry: Registry;
}

/**
 * Defines a module with the required properties and methods.
 * @param module The module definition to declare.
 */
export function defineModule(module: ModuleDeclaration): Declared<Module> {
  return {
    type: DeclarationType.Module,
    registry: new Registry(),
    ...module,
  };
}
