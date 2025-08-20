import type {
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";

export type CompatibleInteraction =
  | MessageComponentInteraction
  | ModalSubmitInteraction;

export interface InteractionHandler<T extends CompatibleInteraction> {
  customId: string;
  check: (interaction: CompatibleInteraction) => interaction is T;
  execute: (interaction: T, args: string[]) => Promise<void>;
}

export function declareInteractionHandler<T extends CompatibleInteraction>(
  handler: InteractionHandler<T>
): Declared<InteractionHandler<T>> {
  return {
    type: DeclarationType.Interaction,
    ...handler,
  };
}
