import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";

/**
 * Represents a command
 */
export interface Command {
  /**
   * The command data used to register the command with Discord.
   */
  data: SlashCommandBuilder;

  /**
   * The function to execute when the command is invoked.
   *
   * @param interaction The interaction that triggered the command.
   */
  execute: (interaction: CommandInteraction) => Promise<void>;
}

/**
 * Declares a command for dynamic import.
 *
 * @param command
 */
export function declareCommand(command: Command): Declared<Command> {
  return {
    type: DeclarationType.Command,
    ...command,
  };
}
