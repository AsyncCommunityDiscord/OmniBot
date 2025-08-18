import { Client, Events } from "discord.js";
import { loadGlobalCommands } from "./core/command-loader.js";
import { loadModules } from "./core/module-loader.js";

const token = process.env["DISCORD_TOKEN"];

const modules = await loadModules("./modules");
const intents = modules.flatMap((module) => module.intents).filter((a) => !!a);

const client = new Client({
  intents: intents,
});

client.once(Events.ClientReady, (readyClient) => {
  for (const module of modules) {
    module.onLoad(readyClient, module.registry);
  }

  loadGlobalCommands(readyClient);
});

await client.login(token);
