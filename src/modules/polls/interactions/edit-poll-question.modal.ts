import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "edit-poll-question-modal",
  check: (interaction) => interaction.isModalSubmit(),
  async execute(interaction) {
    const pollData = pollCreationService.getPoll(interaction.user);

    if (!pollData) {
      await interaction.reply({
        content: "No poll data found. Please start a new poll.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const question = interaction.fields.getTextInputValue(
      "poll-question-input"
    );
    const description = interaction.fields.getTextInputValue(
      "poll-description-input"
    );

    const editedMessage = pollEditionMessage(
      pollCreationService.edit(interaction.user, (pollData) => ({
        ...pollData,
        question,
        description,
      }))
    );

    await (
      await interaction.deferUpdate()
    ).edit({
      components: editedMessage,
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
