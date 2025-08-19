import { GatewayIntentBits } from "discord.js";
import logger from "../../lib/logger.js";
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
  onInstall(_, guild) {
    logger.debug(`Example module installed | guild = ${guild.name}`);
  },
  onUninstall(_, guild) {
    logger.debug(`Example module uninstalled | guild = ${guild.name}`);
  },
});
