import { SlashCommandBuilder } from "discord.js";
import { declareCommand } from "../../../lib/command.js";

export default declareCommand({
  data: new SlashCommandBuilder()
    .setName("other-test")
    .setDescription("Other test command"),

  async execute(interaction) {
    await interaction.reply("This is another test command!");
  },
});
