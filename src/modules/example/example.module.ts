import { GatewayIntentBits } from "discord.js";
import { defineModule } from "../../lib/module.js";
import testCommand from "./commands/test.command.js";

export default defineModule({
  id: "example",
  name: "Example Module",
  description: "An example module for demonstration purposes.",
  version: "1.0.0",
  intents: [GatewayIntentBits.GuildVoiceStates],
  onLoad(_, registry) {
    registry.registerCommand(testCommand);
  },
  onInstall() {},
  onUninstall() {},
});
