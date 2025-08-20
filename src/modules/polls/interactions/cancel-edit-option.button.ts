import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "cancel-edit-option",
  check: (interaction) => interaction.isButton(),
  async execute(interaction) {
    const pollData = pollCreationService.getPoll(interaction.user);

    if (!pollData) {
      await interaction.reply({
        content: "No poll data found for this user.",
        ephemeral: true,
      });
      return;
    }

    await interaction.update({
      components: pollEditionMessage(pollData),
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
