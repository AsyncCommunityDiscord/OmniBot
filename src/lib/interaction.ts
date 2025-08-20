import type { Interaction } from "discord.js";
import { DeclarationType, type Declared } from "./declared.js";

export interface InteractionHandler<T extends Interaction> {
  customId: string;
  check: (interaction: Interaction) => interaction is T;
  execute: (interaction: T, args: string[]) => Promise<void>;
}

export function declareInteractionHandler<T extends Interaction>(
  handler: InteractionHandler<T>
): Declared<InteractionHandler<T>> {
  return {
    type: DeclarationType.Interaction,
    ...handler,
  };
}
