import { MessageFlags } from "discord.js";
import { modules } from "../../index.js";
import { declareEventListener } from "../../lib/listener.js";
import { installModule } from "../loaders/module-installer.js";
import moduleService from "../services/module.service.js";
import { modulesMessage } from "../utils/core-messages.js";

export default declareEventListener({
  eventType: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith("enable-module")) return;

    const moduleId = interaction.customId.split(":")[1];
    if (!moduleId) {
      await interaction.reply({
        content: "The button is malformed. Please try again later.",
        ephemeral: true,
      });
      return;
    }

    const defer = await interaction.deferUpdate();

    try {
      await installModule(
        modules.find((mod) => mod.id === moduleId)!,
        interaction.guild!
      );
    } catch {
      await interaction.followUp({
        content: "Failed to enable the module. Please try again later.",
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
