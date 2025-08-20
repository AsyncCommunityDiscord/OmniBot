import type { MessageComponentInteraction } from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";

export interface InteractionHandler<T extends MessageComponentInteraction> {
  customId: string;
  check: (interaction: MessageComponentInteraction) => interaction is T;
  execute: (interaction: T, args: string[]) => Promise<void>;
}

export function declareInteractionHandler<
  T extends MessageComponentInteraction,
>(handler: InteractionHandler<T>): Declared<InteractionHandler<T>> {
  return {
    type: DeclarationType.Interaction,
    ...handler,
  };
}
