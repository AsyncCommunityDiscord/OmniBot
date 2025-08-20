import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
} from "discord.js";
import logger from "../../../lib/logger.js";
import { Colors } from "../../../utils/colors.js";
import type { PollData, PollOption } from "../data/poll.js";

export function pollEditionMessage(
  data: PollData,
  editOptionIndex: number | null = null
) {
  const question = data.question ?? "*Aucun titre défini*";

  const builder = new ContainerBuilder().setAccentColor(Colors.Turquoise);

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
          .setLabel("Edit question")
          .setStyle(ButtonStyle.Primary)
      )
  );

  builder.addTextDisplayComponents((options) => options.setContent("## ** **"));

  builder.addSeparatorComponents((separator) => separator);
  builder.components.push(...pollOptions(data.options, editOptionIndex));

  builder.addSeparatorComponents((separator) => separator);
  builder.addActionRowComponents((row) =>
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("add-poll-option")
        .setLabel("Add option")
        .setStyle(ButtonStyle.Success)
    )
  );

  return builder;
}

export function pollOptions(
  options: PollOption[],
  editOptionIndex: number | null = null
) {
  logger.debug(
    `Generating poll options display | options = ${JSON.stringify(options)}`
  );
  const sections = [];

  if (options.length === 0) {
    return [new TextDisplayBuilder().setContent("*No defined options*")];
  }

  for (const [index, option] of options.entries()) {
    sections.push(
      new SectionBuilder()
        .addTextDisplayComponents((text) =>
          text.setContent(
            `### ${option.emoji ? `${option.emoji}   ` : ""}${option.description}`
          )
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId(`edit-poll-option:${index}`)
            .setLabel("Edit option")
            .setStyle(ButtonStyle.Secondary)
        )
    );

    logger.debug(
      `Edit option index: ${editOptionIndex}, Current index: ${index}`
    );
    if (editOptionIndex === index) {
      sections.push(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`rename-poll-option:${index}`)
            .setLabel("Rename")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`delete-poll-option:${index}`)
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("cancel-edit-option")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary)
        )
      );
    }

    if (index < options.length - 1) {
      sections.push(new SeparatorBuilder());
    }
  }

  return sections;
}
