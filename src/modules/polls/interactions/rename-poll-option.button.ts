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
  customId: "rename-poll-option",
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

    const modal = new ModalBuilder()
      .setCustomId(`rename-poll-option-modal:${optionIndex}`)
      .setTitle("Rename Poll Option");

    const inputField = new TextInputBuilder()
      .setLabel("New Option Name")
      .setCustomId("new-option-name")
      .setValue(pollData.options[optionIndex]?.description ?? "")
      .setRequired(true)
      .setPlaceholder("Enter the new name for the poll option")
      .setStyle(TextInputStyle.Short);

    const inputFieldRow = new ActionRowBuilder<TextInputBuilder>({
      components: [inputField],
    });
    modal.addComponents(inputFieldRow);

    await interaction.showModal(modal);
  },
});
