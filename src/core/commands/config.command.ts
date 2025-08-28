import {
  ContainerBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { modules } from "../../index.js";
import { declareCommand } from "../../lib/command.js";
import { Colors } from "../../utils/colors.js";
import configService from "../services/config.service.js";
import moduleService from "../services/module.service.js";
import { configurationMessage } from "../utils/core.messages.js";

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
  async execute(interaction) {
    const moduleId = interaction.options.getString("module", true);
    const module = modules.find((m) => m.id === moduleId);

    if (!module) {
      await interaction.reply({
        components: [
          new ContainerBuilder()
            .setAccentColor(Colors.Red)
            .addTextDisplayComponents((text) =>
              text.setContent(`No module with id  \`${moduleId}\``)
            ),
        ],
      });
      return;
    }

    const configProvider = await configService.getConfigForModuleIn(
      module,
      interaction.guildId!
    );

    await interaction.reply({
      components: configurationMessage(module, configProvider),
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
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
