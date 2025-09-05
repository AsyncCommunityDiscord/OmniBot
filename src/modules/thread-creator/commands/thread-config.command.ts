import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { declareCommand } from "../../../lib/command.js";
import logger from "../../../lib/logger.js";
import { ThreadCreatorService } from "../services/thread-creator.service.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("thread-config")
    .setDescription(
      "Configuration du module de création automatique de fils de discussion"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Configurer le canal et les paramètres")
        .addChannelOption((option) =>
          option
            .setName("canal")
            .setDescription("Canal où surveiller les nouveaux messages")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addStringOption((option) =>
          option
            .setName("message-bienvenue")
            .setDescription("Message automatique dans chaque fil créé")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("nom-template")
            .setDescription(
              "Template pour le nom des fils ({messageAuthor}, {messageContent}, {timestamp})"
            )
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("actif")
            .setDescription("Activer ou désactiver la création automatique")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Afficher la configuration actuelle")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Désactiver complètement le module")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: "❌ Cette commande ne peut être utilisée que dans un serveur.",
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    try {
      switch (subcommand) {
        case "setup":
          await handleSetup(interaction, guildId);
          break;
        case "status":
          await handleStatus(interaction, guildId);
          break;
        case "disable":
          await handleDisable(interaction, guildId);
          break;
      }
    } catch (error) {
      logger.error(`Erreur dans la commande thread-config: ${error}`);

      const errorMessage =
        "❌ Une erreur est survenue lors de l'exécution de la commande.";

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
});

async function handleSetup(
  interaction: ChatInputCommandInteraction,
  guildId: string
) {
  const channel = interaction.options.getChannel("canal", true);
  const welcomeMessage = interaction.options.getString("message-bienvenue");
  const nameTemplate = interaction.options.getString("nom-template");
  const enabled = interaction.options.getBoolean("actif");

  const updates: Parameters<typeof ThreadCreatorService.updateConfig>[1] = {
    channelId: channel.id,
  };

  if (welcomeMessage !== null) {
    updates.welcomeMessage = welcomeMessage;
  }

  if (nameTemplate !== null) {
    updates.threadNameTemplate = nameTemplate;
  }

  if (enabled !== null) {
    updates.enabled = enabled;
  }

  await ThreadCreatorService.updateConfig(guildId, updates);

  const embed = {
    color: 0x00ff00,
    title: "✅ Configuration mise à jour",
    fields: [
      {
        name: "Canal surveillé",
        value: `<#${channel.id}>`,
        inline: true,
      },
      {
        name: "État",
        value: updates.enabled !== false ? "🟢 Actif" : "🔴 Inactif",
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  if (welcomeMessage) {
    embed.fields.push({
      name: "Message de bienvenue",
      value: welcomeMessage,
      inline: false,
    });
  }

  if (nameTemplate) {
    embed.fields.push({
      name: "Template de nom",
      value: nameTemplate,
      inline: false,
    });
  }

  await interaction.reply({ embeds: [embed] });
}

async function handleStatus(
  interaction: ChatInputCommandInteraction,
  guildId: string
) {
  const config = await ThreadCreatorService.getConfig(guildId);

  if (!config) {
    await interaction.reply({
      content:
        "❌ Aucune configuration trouvée. Utilisez `/thread-config setup` pour commencer.",
      ephemeral: true,
    });
    return;
  }

  const channel = interaction.guild?.channels.cache.get(config.channelId);

  const embed = {
    color: config.enabled ? 0x00ff00 : 0xff9900,
    title: "📋 Configuration ThreadCreator",
    fields: [
      {
        name: "État",
        value: config.enabled ? "🟢 Actif" : "🔴 Inactif",
        inline: true,
      },
      {
        name: "Canal surveillé",
        value: channel
          ? `<#${config.channelId}>`
          : `❌ Canal introuvable (${config.channelId})`,
        inline: true,
      },
      {
        name: "Message de bienvenue",
        value: config.welcomeMessage || "Aucun",
        inline: false,
      },
      {
        name: "Template de nom",
        value: config.threadNameTemplate,
        inline: false,
      },
    ],
    footer: {
      text: `Configuré le ${config.createdAt.toLocaleDateString("fr-FR")}`,
    },
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed] });
}

async function handleDisable(
  interaction: ChatInputCommandInteraction,
  guildId: string
) {
  await ThreadCreatorService.updateConfig(guildId, { enabled: false });

  const embed = {
    color: 0xff0000,
    title: "🔴 Module désactivé",
    description:
      "La création automatique de fils de discussion a été désactivée.\nUtilisez `/thread-config setup` pour la réactiver.",
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed] });
}
