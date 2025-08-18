import {
  ButtonStyle,
  InteractionContextType,
  MessageFlags,
  SectionBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { declareCommand } from "../../lib/command.js";

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

    await interaction.reply({
      components: [
        new SectionBuilder()
          .addTextDisplayComponents((textDisplay) =>
            textDisplay.setContent("This is a module command response")
          )
          .setButtonAccessory((button) =>
            button
              .setURL("https://google.com")
              .setLabel("Google")
              .setStyle(ButtonStyle.Link)
          ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  },

  async complete(interaction) {
    console.log("Module command autocomplete:", interaction.commandName);

    await interaction.respond([
      {
        name: "test",
        value: "This is a test completion response",
      },
    ]);
  },
});
