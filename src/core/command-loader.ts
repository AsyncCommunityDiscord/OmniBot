import type { Client } from "discord.js";
import type { Module } from "../lib/module.js";

export function loadCommands(client: Client, module: Module) {
  const commands = module.registry.commands;

  console.log(
    `Loading ${commands.length} command(s) from module ${module.id}...`
  );

  // TODO: register commands with whatever shitty way discord.js has

  return commands;
}
