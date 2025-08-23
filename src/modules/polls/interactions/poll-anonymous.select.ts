import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollDetailsMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "poll-anonymous-select",
  check: (interaction) => interaction.isStringSelectMenu(),
  async execute(interaction) {
    const pollData = pollCreationService.getPoll(interaction.user);

    if (!pollData) {
      await interaction.reply({
        content: "No poll data found for this user.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const isAnonymous = !!interaction.values.find((value) => value === "yes");

    const editedMessage = pollDetailsMessage(
      pollCreationService.edit(interaction.user, (data) => ({
        ...data,
        anonymous: isAnonymous,
      }))
    );

    await interaction.update({
      components: editedMessage,
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
