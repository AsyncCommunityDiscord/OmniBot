import { defineModule } from "../lib/module.js";
import moduleCommand from "./commands/module.command.js";
import disableModuleButton from "./interactions/disable-module.button.js";
import enableModuleButton from "./interactions/enable-module.button.js";
import commandListener from "./listeners/command.listener.js";

export default defineModule({
  id: "core",
  name: "Core Module",
  description:
    "The core module of the application, managing core commands and events. It is always loaded.",
  version: "1.1.1",
  intents: [],
  onLoad(_, registry) {
    // Register the core module's commands and events in the provided registry
    registry.registerCommand(moduleCommand);
    registry.registerEventListener(commandListener);
    registry.registerEventListener(enableModuleButton);
    registry.registerEventListener(disableModuleButton);
  },
  onInstall() {
    throw new Error("Core module cannot be installed or uninstalled.");
  },
  onUninstall() {
    throw new Error("Core module cannot be installed or uninstalled.");
  },
});
