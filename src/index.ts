import { Client, Events } from "discord.js";
import { loadModules } from "./loader/loader.js";

const token = process.env["DISCORD_TOKEN"];

const modules = await loadModules("./modules");
const intents = modules.flatMap((module) => module.intents).filter((a) => !!a);

export const client = new Client({
  intents: intents,
});

client.once(Events.ClientReady, (client) => {
  modules.forEach((module) => module.init(client));
});

await client.login(token);
