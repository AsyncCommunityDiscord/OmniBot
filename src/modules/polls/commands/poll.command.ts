import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { declareCommand } from "../../../lib/command.js";
import logger from "../../../lib/logger.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll"),
  async execute(interaction) {
    const pollData = pollCreationService.getOrCreatePoll(interaction.user);

    logger.debug(
      `Poll data for user ${interaction.user.id} | data = ${pollData}`
    );

    logger.debug("Creating poll edition message");
    const editionMessage = pollEditionMessage(pollData);
    logger.debug("Container builder created for poll edition");

    await interaction.reply({
      components: editionMessage,
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  },
});
