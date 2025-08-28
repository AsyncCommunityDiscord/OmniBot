import { MessageFlags } from "discord.js";
import { modules } from "../../index.js";
import { declareInteractionHandler } from "../../lib/interaction.js";
import { uninstallModule } from "../loaders/module-installer.js";
import moduleService from "../services/module.service.js";
import { modulesMessage } from "../utils/core.messages.js";

export default declareInteractionHandler({
  customId: "disable-module",
  check: (interaction) => interaction.isButton(),
  async execute(interaction, args) {
    const moduleId = args[0];
    if (!moduleId) {
      await interaction.reply({
        content: "The button is malformed. Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const defer = await interaction.deferUpdate();

    try {
      await uninstallModule(
        modules.find((mod) => mod.id === moduleId)!,
        interaction.guild!
      );
    } catch {
      await interaction.followUp({
        content: "Failed to disable the module. Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const modulesState = await moduleService.getAllModulesStateIn(
      interaction.guildId!
    );

    await defer.edit({
      components: [modulesMessage(modulesState)],
      flags: MessageFlags.IsComponentsV2,
    });
  },
});
