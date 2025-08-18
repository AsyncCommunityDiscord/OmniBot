import {
  type ChatInputCommandInteraction,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { declareCommand } from "../../lib/command.js";
import { Colors } from "../../utils/colors.js";
import { installModule, uninstallModule } from "../loaders/module-installer.js";
import moduleService from "../services/module.service.js";

async function moduleList(interaction: ChatInputCommandInteraction) {
  const defer = await interaction.deferReply();

  // Guild ID is always defined since the command is a guild-only command
  const modulesState = await moduleService.getAllModulesStateIn(
    interaction.guildId!
  );

  const container = new ContainerBuilder().setAccentColor(Colors.Turquoise);
  container.addTextDisplayComponents(
    (text) => text.setContent("# Modules"),
    (text) =>
      text.setContent(
        "The modules marked with ✅ are enabled, while those marked with ❌ are disabled."
      )
  );
  container.addSeparatorComponents((separator) => separator.setDivider(true));

  for (let state of modulesState) {
    const emoji = state.enabled ? "✅" : "❌";

    container.addTextDisplayComponents((text) =>
      text.setContent(
        `${emoji} \`${state.module.name}\`\n> ${state.module.description}`
      )
    );
  }

  await defer.edit({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  });
}

async function enableModule(interaction: ChatInputCommandInteraction) {
  const moduleName = interaction.options.getString("name", true);
  const module = moduleService
    .getAllModules()
    .find((mod) => mod.id === moduleName);

  if (!module) {
    await interaction.reply({
      content: `Module "${moduleName}" not found.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    await installModule(module, interaction.guild!);
    await interaction.reply({
      content: `Module "${moduleName}" has been installed successfully.`,
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    console.error("Error installing module:", error);
    await interaction.reply({
      content: `Failed to install module "${moduleName}". Please check the logs for more details.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}

async function disableModule(interaction: ChatInputCommandInteraction) {
  const moduleName = interaction.options.getString("name", true);
  const module = moduleService
    .getAllModules()
    .find((mod) => mod.id === moduleName);

  if (!module) {
    await interaction.reply({
      content: `Module "${moduleName}" not found.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    await uninstallModule(module, interaction.guild!);
    await interaction.reply({
      content: `Module "${moduleName}" has been uninstalled successfully.`,
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    console.error("Error uninstalling module:", error);
    await interaction.reply({
      content: `Failed to uninstall module "${moduleName}". Please check the logs for more details.`,
      flags: MessageFlags.Ephemeral,
    });
  }
}

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("module")
    .setDescription("Module management commands")
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all available modules")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("install")
        .setDescription("Install a module by name")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the module")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("uninstall")
        .setDescription("Uninstall a module by name")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the module")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(0x8)
    .setContexts([InteractionContextType.Guild]),

  async execute(interaction) {
    console.log("Module command executed:", interaction.commandName);

    switch (interaction.options.getSubcommand()) {
      case "list":
        await moduleList(interaction);
        break;
      case "install":
        await enableModule(interaction);
        break;
      case "uninstall":
        await disableModule(interaction);
        break;
      default:
        await interaction.reply({
          content: "Unknown subcommand",
          flags: MessageFlags.Ephemeral,
        });
    }
  },

  async complete(interaction) {
    console.log("Module command autocomplete:", interaction.commandName);

    const modules = moduleService.getAllModules();

    await interaction.respond(
      modules.map((module) => ({
        name: module.name,
        value: module.id,
      }))
    );
  },
});
