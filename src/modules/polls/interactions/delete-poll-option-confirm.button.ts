import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "delete-poll-option-confirm",
  check: (interaction) => interaction.isButton(),
  async execute(interaction, args) {
    const pollData = pollCreationService.getPoll(interaction.user);

    if (!pollData) {
      await interaction.reply({
        content: "No poll data found for this user.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const optionIndex = parseInt(args[0] ?? "0", 10);

    const editedMessage = pollEditionMessage(
      pollCreationService.edit(interaction.user, (pollData) => {
        pollData.options.splice(optionIndex, 1);
        return {
          ...pollData,
        };
      })
    );

    await interaction.update({
      components: editedMessage,
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
