import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { declareCommand } from "../../../lib/command.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollEditionMessage } from "../utils/poll.messages.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll"),
  async execute(interaction) {
    const pollData = pollCreationService.getOrCreatePoll(interaction.user);

    const editionMessage = pollEditionMessage(pollData);

    await interaction.reply({
      components: editionMessage,
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  },
});
