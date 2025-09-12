import { type Message, ChannelType } from "discord.js";
import { declareEventListener } from "../../../lib/listener.js";
import logger from "../../../lib/logger.js";
import threadCreatorService from "../services/thread-creator.service.js";

export default declareEventListener({
  eventType: "messageCreate",

  async execute(message: Message) {
    // Ignorer les messages des bots
    if (message.author.bot) {
      return;
    }

    // Ne traiter que les messages dans les serveurs
    if (!message.guild) {
      return;
    }

    // Ne traiter que les messages dans les canaux textuels
    if (message.channel.type !== ChannelType.GuildText) {
      return;
    }

    // Ignorer les messages dans les fils de discussion
    if (message.channel.isThread()) {
      return;
    }

    try {
      await threadCreatorService.createThreadForMessage(message);
    } catch (error) {
      logger.error(
        `Erreur dans le listener messageCreate du ThreadCreator : ${error}`
      );
    }
  },
});
