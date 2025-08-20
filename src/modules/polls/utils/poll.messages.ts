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
  editOptionIndex: number | null = null,
  confirmDelete: boolean = false
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
          .setLabel("Edit")
          .setStyle(ButtonStyle.Secondary)
      )
  );

  builder.addTextDisplayComponents((options) => options.setContent("## ** **"));

  builder.addSeparatorComponents((separator) => separator);
  builder.components.push(
    ...pollOptions(data.options, editOptionIndex, confirmDelete)
  );

  builder.addSeparatorComponents((separator) => separator);
  builder.addActionRowComponents((row) =>
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("add-poll-option")
        .setEmoji("➕")
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
              `### ${option.emoji ? `${option.emoji}   ` : ""}${option.description}`
            )
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId(`edit-poll-option:${index}`)
              .setLabel("Edit")
              .setStyle(ButtonStyle.Secondary)
          )
      );
    } else {
      sections.push(
        new SectionBuilder()
          .addTextDisplayComponents((text) =>
            text.setContent(
              `### ${option.emoji ? `${option.emoji}   ` : ""}${option.description}`
            )
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId("cancel-edit-option")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Secondary)
          ),
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`move-poll-option-up:${index}`)
            .setEmoji("⬆️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`move-poll-option-down:${index}`)
            .setEmoji("⬇️")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`rename-poll-option:${index}`)
            .setEmoji("✏️")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(`delete-poll-option:${index}`)
            .setEmoji("🗑️")
            .setDisabled(confirmDelete)
            .setStyle(ButtonStyle.Danger)
        )
      );
    }

    if (index < options.length - 1) {
      sections.push(new SeparatorBuilder());
    }
  }

  return sections;
}
