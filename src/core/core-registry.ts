import { Registry } from "../lib/registry.js";
import moduleCommand from "./commands/module.command.js";
import commandListener from "./listeners/command.listener.js";

/**
 * Core module registry for the application.
 * This registry is used to manage core modules and their commands and events.
 */
const coreRegistry = new Registry();

// Register all the core commands
coreRegistry.registerCommand(moduleCommand);

// Register all the core events
coreRegistry.registerEventListener(commandListener);

export default coreRegistry;
