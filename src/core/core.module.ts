import { defineModule } from "../lib/module.js";
import moduleCommand from "./commands/module.command.js";
import commandListener from "./listeners/command.listener.js";

export default defineModule({
  id: "core",
  name: "Core Module",
  description:
    "The core module of the application, managing core commands and events. It is always loaded.",
  version: "1.0.0",
  intents: [],
  onLoad(_, registry) {
    // Register the core module's commands and events in the provided registry
    registry.registerCommand(moduleCommand);
    registry.registerEventListener(commandListener);
  },
  onInstall() {
    throw new Error("Core module cannot be installed or uninstalled.");
  },
  onUninstall() {
    throw new Error("Core module cannot be installed or uninstalled.");
  },
});
