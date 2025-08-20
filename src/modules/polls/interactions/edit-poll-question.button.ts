import {
  ActionRowBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";

export default declareInteractionHandler({
  customId: "edit-poll-question",
  check: (interaction) => interaction.isButton(),
  async execute(interaction) {
    const pollData = pollCreationService.getPoll(interaction.user);

    if (!pollData) {
      await interaction.reply({
        content: "No poll data found. Please start a new poll.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("edit-poll-question-modal")
      .setTitle("Edit Poll Question");

    const question = new TextInputBuilder()
      .setCustomId("poll-question-input")
      .setLabel("Question")
      .setValue(pollData.question ?? "")
      .setPlaceholder("Enter the poll question")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("poll-description-input")
      .setLabel("Description")
      .setValue(pollData.description ?? "")
      .setPlaceholder("Enter a description for the poll")
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

    const questionRow = new ActionRowBuilder<TextInputBuilder>({
      components: [question],
    });
    const descriptionRow = new ActionRowBuilder<TextInputBuilder>({
      components: [description],
    });

    modal.addComponents(questionRow, descriptionRow);

    await interaction.showModal(modal);
  },
});
