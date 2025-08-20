import { MessageFlags } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import logger from "../../../lib/logger.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "edit-poll-option",
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
    logger.debug(`Index is ${optionIndex}`);

    await interaction.update({
      components: pollEditionMessage(pollData, optionIndex),
    });
  },
});
