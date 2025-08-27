import { SlashCommandBuilder } from "discord.js";
import { declareCommand } from "../../lib/command.js";
import moduleService from "../services/module.service.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure the modules of the bot")
    .setDefaultMemberPermissions(0x8)
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("The module to configure")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute() {},
  async complete(interaction) {
    const modules = await moduleService.getAllModulesStateIn(
      interaction.guildId!
    );

    const moduleNames = modules
      .filter((m) => m.enabled)
      .map((m) => ({ name: m.module.name, value: m.module.id }));

    await interaction.respond([
      ...moduleNames,
      {
        name: "Base",
        value: "core",
      },
    ]);
  },
});
