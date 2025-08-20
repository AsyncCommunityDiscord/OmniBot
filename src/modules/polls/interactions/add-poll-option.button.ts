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
  customId: "add-poll-option",
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

    const modal = new ModalBuilder();
    modal.setCustomId("add-poll-option-modal");
    modal.setTitle("Add Poll Option");

    const optionInput = new TextInputBuilder({
      customId: "poll-option-input",
      label: "Option",
      placeholder: "Enter the poll option",
      required: true,
      style: TextInputStyle.Short,
    });

    const optionRow = new ActionRowBuilder<TextInputBuilder>({
      components: [optionInput],
    });

    modal.addComponents(optionRow);

    await interaction.showModal(modal);
  },
});
