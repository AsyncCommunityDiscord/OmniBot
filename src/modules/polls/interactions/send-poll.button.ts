import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollDetailsMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "send-poll",
  check: (interaction) => interaction.isButton(),
  execute: async (interaction) => {
    const pollData = pollCreationService.getPoll(interaction.user);
    if (!pollData) {
      await interaction.reply({
        content: "This message does not contain a valid poll.",
        ephemeral: true,
      });

      return;
    }

    await interaction.reply({
      components: pollDetailsMessage(pollData),
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
