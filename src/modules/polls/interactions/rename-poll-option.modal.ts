import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "rename-poll-option-modal",
  check: (interaction) => interaction.isModalSubmit(),
  async execute(interaction, args) {
    const pollData = pollCreationService.getPoll(interaction.user);
    if (!pollData) {
      await interaction.reply({
        content: "This message does not contain a poll.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const optionIndex = parseInt(args[0]!, 10);

    const newName = interaction.fields.getTextInputValue("new-option-name");

    const editedMessage = pollEditionMessage(
      pollCreationService.edit(interaction.user, (pollData) => ({
        ...pollData,
        options: pollData.options.map((option, index) =>
          index === optionIndex ? { ...option, description: newName } : option
        ),
      })),
      optionIndex
    );

    await (
      await interaction.deferUpdate()
    ).edit({
      components: editedMessage,
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
