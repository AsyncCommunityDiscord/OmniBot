import { Client, Events } from "discord.js";
import { loadModules } from "./loader/loader.js";

const token = process.env["DISCORD_TOKEN"];

const modules = await loadModules("./modules");
const intents = modules.flatMap((module) => module.intents).filter((a) => !!a);

const client = new Client({
  intents: intents,
});

client.once(Events.ClientReady, (readyClient) => {
  console.log("Bot is ready!", readyClient.options.intents);
});

await client.login(token);
