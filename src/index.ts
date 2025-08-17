import { Client, Events } from "discord.js";
import { loadCommands } from "./core/command-loader.js";
import { loadModules } from "./core/module-loader.js";

const token = process.env["DISCORD_TOKEN"];

const modules = await loadModules("./modules");
const intents = modules.flatMap((module) => module.intents).filter((a) => !!a);

const client = new Client({
  intents: intents,
});

client.once(Events.ClientReady, (readyClient) => {
  for (const module of modules) {
    module.init(readyClient, module.registry);

    loadCommands(readyClient, module);
  }
});

await client.login(token);
