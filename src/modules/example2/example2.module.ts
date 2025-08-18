import { GatewayIntentBits } from "discord.js";
import { defineModule } from "../../lib/module.js";
import otherTestCommand from "./commands/other-test.command.js";

export default defineModule({
  id: "example-2",
  name: "Second Example Module",
  description: "An example module for demonstration purposes.",
  version: "1.0.0",
  intents: [GatewayIntentBits.GuildVoiceStates],
  onLoad(_, registry) {
    registry.registerCommand(otherTestCommand);
  },
  onInstall() {},
  onUninstall() {},
});
