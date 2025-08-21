import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "move-poll-option",
  check: (interaction) => interaction.isButton(),
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
    const direction = args[1] as "up" | "down";

    const editedMessage = pollEditionMessage(
      pollCreationService.edit(interaction.user, (pollData) => {
        const newOptions = [...pollData.options];
        if (direction === "up" && optionIndex > 0) {
          // Move option up
          const temp = newOptions[optionIndex - 1]!;
          newOptions[optionIndex - 1] = newOptions[optionIndex]!;
          newOptions[optionIndex] = temp;
        } else if (
          direction === "down" &&
          optionIndex < newOptions.length - 1
        ) {
          // Move option down
          const temp = newOptions[optionIndex + 1]!;
          newOptions[optionIndex + 1] = newOptions[optionIndex]!;
          newOptions[optionIndex] = temp;
        }

        return {
          ...pollData,
          options: newOptions,
        };
      }),
      optionIndex + (direction === "up" ? -1 : 1)
    );

    await interaction.update({
      components: editedMessage,
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
