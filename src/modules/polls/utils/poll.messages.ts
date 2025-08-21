import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
} from "discord.js";
import logger from "../../../lib/logger.js";
import type { PollData, PollOption } from "../data/poll.js";
import {
  addIcon,
  deleteIcon,
  moveDownIcon,
  moveUpIcon,
  okIcon,
  renameIcon,
} from "./poll.icons.js";

export function pollEditionMessage(
  data: PollData,
  editOptionIndex: number | null = null,
  confirmDelete: boolean = false
) {
  const question = data.question ?? "*Aucun titre défini*";

  const builder = new ContainerBuilder();

  builder.addTextDisplayComponents((header) =>
    header.setContent("**Édition du sondage**")
  );

  builder.addSectionComponents((titleSection) =>
    titleSection
      .addTextDisplayComponents(
        (title) => title.setContent(`# ${question}`),
        (description) =>
          description.setContent(
            `${data.description ? `>>> ${data.description}` : "*Aucune description définie*"}`
          )
      )
      .setButtonAccessory(
        new ButtonBuilder()
          .setCustomId("edit-poll-question")
          .setEmoji(renameIcon)
          .setDisabled(confirmDelete)
          .setStyle(ButtonStyle.Secondary)
      )
  );

  builder.addSeparatorComponents((separator) => separator);
  builder.components.push(
    ...pollOptions(data.options, editOptionIndex, confirmDelete)
  );

  builder.addSeparatorComponents((separator) => separator);
  builder.addActionRowComponents((row) =>
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("add-poll-option")
        .setEmoji(addIcon)
        .setDisabled(data.options.length >= 5 || confirmDelete)
        .setLabel("Add option")
        .setStyle(ButtonStyle.Primary)
    )
  );

  const components = [builder];
  if (confirmDelete) {
    components.push(
      new ContainerBuilder()
        .addTextDisplayComponents((warning) =>
          warning.setContent("Are you sure you want to delete this option?")
        )
        .addActionRowComponents((row) =>
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`delete-poll-option-confirm:${editOptionIndex}`)
              .setLabel("Confirm")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("edit-poll-option")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Secondary)
          )
        )
    );
  }

  return components;
}

export function pollOptions(
  options: PollOption[],
  editOptionIndex: number | null = null,
  confirmDelete: boolean = false
) {
  logger.debug(
    `Generating poll options display | options = ${JSON.stringify(options)}`
  );
  const sections = [];

  if (options.length === 0) {
    return [new TextDisplayBuilder().setContent("*No defined options*")];
  }

  for (const [index, option] of options.entries()) {
    if (editOptionIndex !== index) {
      sections.push(
        new SectionBuilder()
          .addTextDisplayComponents((text) =>
            text.setContent(
              `### ${option.emoji ?? numberAsEmoji(index + 1)}   ${option.description}`
            )
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId(`edit-poll-option:${index}`)
              .setEmoji(renameIcon)
              .setDisabled(confirmDelete)
              .setStyle(ButtonStyle.Secondary)
          )
      );
    } else {
      sections.push(
        new SectionBuilder()
          .addTextDisplayComponents((text) =>
            text.setContent(
              `### ${option.emoji ?? numberAsEmoji(index + 1)}   ${option.description}`
            )
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId("cancel-edit-option")
              .setEmoji(okIcon)
              .setDisabled(confirmDelete)
              .setStyle(ButtonStyle.Success)
          ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`move-poll-option:${index}:up`)
            .setEmoji(moveUpIcon)
            .setDisabled(index === 0 || confirmDelete)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`move-poll-option:${index}:down`)
            .setEmoji(moveDownIcon)
            .setDisabled(index === options.length - 1 || confirmDelete)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`rename-poll-option:${index}`)
            .setEmoji(renameIcon)
            .setDisabled(confirmDelete)
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`delete-poll-option:${index}`)
            .setEmoji(deleteIcon)
            .setDisabled(confirmDelete)
            .setStyle(ButtonStyle.Danger)
        )
      );
    }
  }

  return sections;
}

const numberAsEmoji = (number: number) => {
  const str = number.toString(10).split("");

  return str
    .map(
      (chr) =>
        ({
          "0": "0️⃣",
          "1": "1️⃣",
          "2": "2️⃣",
          "3": "3️⃣",
          "4": "4️⃣",
          "5": "5️⃣",
          "6": "6️⃣",
          "7": "7️⃣",
          "8": "8️⃣",
          "9": "9️⃣",
        })[chr]
    )
    .join("");
};
