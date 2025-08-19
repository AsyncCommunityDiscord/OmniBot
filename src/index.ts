import { Client, Events } from "discord.js";
import coreModule from "./core/core.module.js";
import {
  checkCommandsForVersionChange,
  loadGlobalCommands,
} from "./core/loaders/command-loader.js";
import {
  loadGlobalEvents,
  loadModuleEvents,
} from "./core/loaders/listener-loader.js";
import { loadModules } from "./core/loaders/module-loader.js";

const token = process.env["DISCORD_TOKEN"];

export const modules = await loadModules("./modules");
const intents = modules.flatMap((module) => module.intents).filter((a) => !!a);

export const client = new Client({
  intents: intents,
});

client.once(Events.ClientReady, async (readyClient) => {
  for (const module of modules) {
    module.onLoad(readyClient, module.registry);
    loadModuleEvents(readyClient, module);
    await checkCommandsForVersionChange(readyClient, module);
  }

  coreModule.onLoad(readyClient, coreModule.registry);

  loadGlobalCommands(readyClient);
  loadGlobalEvents(readyClient);
});

await client.login(token);
