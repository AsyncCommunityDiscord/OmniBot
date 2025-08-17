import { GatewayIntentBits } from "discord.js";
import { defineModule } from "../../lib/module.js";

export default defineModule({
  id: "example",
  name: "Example Module",
  description: "An example module for demonstration purposes.",
  version: "1.0.0",
  intents: [GatewayIntentBits.GuildVoiceStates],
  init() {},
  install() {},
  uninstall() {},
});
