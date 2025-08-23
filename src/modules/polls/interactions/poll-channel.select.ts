import { ContainerBuilder, MessageFlags, type TextChannel } from "discord.js";
import { declareInteractionHandler } from "../../../lib/interaction.js";
import pollCreationService from "../services/poll-creation.service.js";
import { pollDetailsMessage } from "../utils/poll.messages.js";

export default declareInteractionHandler({
  customId: "poll-channel-select",
  check: (interaction) => interaction.isChannelSelectMenu(),
  execute: async (interaction) => {
    const pollData = pollCreationService.getPoll(interaction.user);
    if (!pollData) {
      await interaction.reply({
        content: "This message does not contain a valid poll.",
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const channel = interaction.channels.find(() => true);

    if (!channel) {
      await interaction.reply({
        components: [
          new ContainerBuilder().addTextDisplayComponents((text) =>
            text.setContent("Please select a channel to send the poll.")
          ),
        ],
        flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
      });
      return;
    }

    const editedMessage = pollDetailsMessage(
      pollCreationService.edit(interaction.user, (data) => ({
        ...data,
        channel: channel as TextChannel,
      }))
    );

    await interaction.update({
      components: editedMessage,
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  },
});
