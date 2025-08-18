import type {
  AutocompleteInteraction,
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";

/**
 * Represents a command
 */
export interface Command {
  /**
   * The command data used to register the command with Discord.
   */
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandSubcommandGroupBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;

  /**
   * The function to execute when the command is invoked.
   *
   * @param interaction The interaction that triggered the command.
   */
  execute: (interaction: CommandInteraction) => Promise<void>;

  /**
   * Optional function to handle autocomplete interactions for the command.
   *
   * @param interaction The autocomplete interaction that triggered the command.
   */
  complete?: (interaction: AutocompleteInteraction) => Promise<void>;
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
