import {
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { declareCommand } from "../../lib/command.js";
import moduleService from "../services/module.service.js";
import { modulesMessage } from "../utils/core.messages.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("modules")
    .setDescription("Manage server modules")
    .setDefaultMemberPermissions(0x8)
    .setContexts([InteractionContextType.Guild]),

  async execute(interaction) {
    const defer = await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const modulesState = await moduleService.getAllModulesStateIn(
      interaction.guildId!
    );

    await defer.edit({
      components: [modulesMessage(modulesState)],
      flags: MessageFlags.IsComponentsV2,
    });
  },
});
