import { ModuleRegistry } from "../lib/module.js";
import moduleCommand from "./commands/module.command.js";

/**
 * Core module registry for the application.
 * This registry is used to manage core modules and their commands and events.
 */
const coreRegistry = new ModuleRegistry();

coreRegistry.registerCommand(moduleCommand);

export default coreRegistry;
