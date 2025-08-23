import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ContainerBuilder,
  type MessageActionRowComponentBuilder,
  SectionBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextDisplayBuilder,
} from "discord.js";
import type { PollData, PollOption } from "../data/poll.js";
import {
  addIcon,
  deleteIcon,
  moveDownIcon,
  moveUpIcon,
  okIcon,
  renameIcon,
  sendIcon,
} from "./poll.icons.js";

export function pollEditionMessage(
  data: PollData,
  editOptionIndex: number | null = null,
  confirmDelete: boolean = false
) {
  const components = [
    createMainPollEditor(data, editOptionIndex, confirmDelete),
  ];

  if (confirmDelete) {
    components.push(createDeleteConfirmation(editOptionIndex));
  }

  return components;
}

function createMainPollEditor(
  data: PollData,
  editOptionIndex: number | null,
  confirmDelete: boolean
) {
  const container = new ContainerBuilder()
    .addTextDisplayComponents((header) =>
      header.setContent("**Édition du sondage**")
    )
    .addSectionComponents((section) =>
      createTitleSection(section, data, confirmDelete)
    )
    .addSeparatorComponents((separator) => separator);

  container.components.push(
    ...pollOptions(data.options, editOptionIndex, confirmDelete)
  );

  return container
    .addSeparatorComponents((separator) => separator)
    .addActionRowComponents((row) =>
      createMainActions(row, data.options.length, confirmDelete)
    );
}

function createTitleSection(
  section: SectionBuilder,
  data: PollData,
  confirmDelete: boolean
) {
  const question = data.question ?? "*Aucun titre défini*";
  const description = data.description
    ? `>>> ${data.description}`
    : "*Aucune description définie*";

  return section
    .addTextDisplayComponents(
      (title) => title.setContent(`# ${question}`),
      (desc) => desc.setContent(description)
    )
    .setButtonAccessory(
      new ButtonBuilder()
        .setCustomId("edit-poll-question")
        .setEmoji(renameIcon)
        .setDisabled(confirmDelete)
        .setStyle(ButtonStyle.Secondary)
    );
}

function createMainActions(
  row: ActionRowBuilder<MessageActionRowComponentBuilder>,
  optionsCount: number,
  confirmDelete: boolean
) {
  return row.addComponents(
    new ButtonBuilder()
      .setCustomId("add-poll-option")
      .setEmoji(addIcon)
      .setDisabled(optionsCount >= 5 || confirmDelete)
      .setLabel("Add option")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("send-poll")
      .setEmoji(sendIcon)
      .setDisabled(confirmDelete)
      .setLabel("Send")
      .setStyle(ButtonStyle.Success)
  );
}

function createDeleteConfirmation(editOptionIndex: number | null) {
  return new ContainerBuilder()
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
    );
}

export function pollOptions(
  options: PollOption[],
  editOptionIndex: number | null = null,
  confirmDelete: boolean = false
): (
  | TextDisplayBuilder
  | ActionRowBuilder<MessageActionRowComponentBuilder>
  | SectionBuilder
)[] {
  if (options.length === 0) {
    return [new TextDisplayBuilder().setContent("*No defined options*")];
  }

  return options.flatMap((option, index) =>
    editOptionIndex === index
      ? createEditingOption(option, index, options.length, confirmDelete)
      : createStandardOption(option, index, confirmDelete)
  );
}

function createStandardOption(
  option: PollOption,
  index: number,
  confirmDelete: boolean
) {
  return new SectionBuilder()
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
    );
}

function createEditingOption(
  option: PollOption,
  index: number,
  totalOptions: number,
  confirmDelete: boolean
): (SectionBuilder | ActionRowBuilder<MessageActionRowComponentBuilder>)[] {
  const section = new SectionBuilder()
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
    );

  const actionRow =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`move-poll-option:${index}:up`)
        .setEmoji(moveUpIcon)
        .setDisabled(index === 0 || confirmDelete)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`move-poll-option:${index}:down`)
        .setEmoji(moveDownIcon)
        .setDisabled(index === totalOptions - 1 || confirmDelete)
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
    );

  return [section, actionRow];
}

export function pollDetailsMessage(data: PollData) {
  return [
    new ContainerBuilder()
      .addTextDisplayComponents((channelHeader) =>
        channelHeader.setContent(
          "In what channel do you want to send the poll?"
        )
      )
      .addActionRowComponents((row) => createChannelSelector(row, data))
      .addTextDisplayComponents((durationHeader) =>
        durationHeader.setContent("When do you want the poll to end?")
      )
      .addActionRowComponents((row) => createDurationSelector(row, data))
      .addTextDisplayComponents((anonymousHeader) =>
        anonymousHeader.setContent("Do you want the poll to be anonymous?")
      )
      .addActionRowComponents((row) => createAnonymousSelector(row, data))
      .addActionRowComponents((row) => createSendButton(row, data)),
  ];
}

function createChannelSelector(
  row: ActionRowBuilder<MessageActionRowComponentBuilder>,
  data: PollData
) {
  return row.addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId("poll-channel-select")
      .setPlaceholder("Select a channel")
      .setDefaultChannels(data.channel?.id ?? "0")
      .setChannelTypes([
        ChannelType.GuildText,
        ChannelType.GuildAnnouncement,
        ChannelType.PublicThread,
        ChannelType.PrivateThread,
      ])
      .setMinValues(1)
      .setMaxValues(1)
  );
}

function createDurationSelector(
  row: ActionRowBuilder<MessageActionRowComponentBuilder>,
  data: PollData
) {
  const select = new StringSelectMenuBuilder()
    .setCustomId("poll-duration-select")
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("1 hour")
        .setValue("1h")
        .setDefault(data.duration === "1h"),
      new StringSelectMenuOptionBuilder()
        .setLabel("6 hours")
        .setValue("6h")
        .setDefault(data.duration === "6h"),
      new StringSelectMenuOptionBuilder()
        .setLabel("12 hours")
        .setValue("12h")
        .setDefault(data.duration === "12h"),
      new StringSelectMenuOptionBuilder()
        .setLabel("1 day")
        .setValue("1d")
        .setDefault(data.duration === "1d"),
      new StringSelectMenuOptionBuilder()
        .setLabel("5 days")
        .setValue("5d")
        .setDefault(data.duration === "5d"),
      new StringSelectMenuOptionBuilder()
        .setLabel("1 week")
        .setValue("7d")
        .setDefault(data.duration === "7d")
    );

  if (
    !["1h", "6h", "12h", "1d", "5d", "7d"].includes(data.duration) &&
    data.duration
  ) {
    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(`${data.duration} (custom)`)
        .setValue(data.duration)
        .setDefault(true)
    );
  }

  select.addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel("Custom")
      .setValue("custom")
      .setDefault(
        !["1h", "6h", "12h", "1d", "5d", "7d"].includes(data.duration)
      )
  );

  return row.addComponents(select);
}

function createAnonymousSelector(
  row: ActionRowBuilder<MessageActionRowComponentBuilder>,
  data: PollData
) {
  return row.addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("poll-anonymous-select")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Yes")
          .setEmoji("✅")
          .setDescription("The results will be anonymous")
          .setValue("yes")
          .setDefault(data.anonymous),
        new StringSelectMenuOptionBuilder()
          .setLabel("No")
          .setEmoji("❌")
          .setDescription("The results will not be anonymous")
          .setValue("no")
          .setDefault(!data.anonymous)
      )
  );
}

function createSendButton(
  row: ActionRowBuilder<MessageActionRowComponentBuilder>,
  data: PollData
) {
  return row.addComponents(
    new ButtonBuilder()
      .setCustomId("send-poll-confirm")
      .setEmoji(sendIcon)
      .setLabel("Send")
      .setDisabled(!data.channel)
      .setStyle(ButtonStyle.Success)
  );
}

const numberAsEmoji = (number: number) => {
  return number
    .toString(10)
    .split("")
    .map((chr) => chr + "️⃣")
    .join("");
};
