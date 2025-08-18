import { SlashCommandBuilder } from "discord.js";
import { declareCommand } from "../../../lib/command.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),

  async execute(interaction) {
    await interaction.reply("This is a test command!");
  },
});
