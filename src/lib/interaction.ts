import type {
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import type { Config, Configured } from "./config.js";
import { DeclarationType, type Declared } from "./declared.js";

export type CompatibleInteraction =
  | MessageComponentInteraction
  | ModalSubmitInteraction;

export interface InteractionHandler<
  Interaction extends CompatibleInteraction,
  ConfigType extends Config = any,
> {
  customId: string;
  check: (
    interaction: CompatibleInteraction,
    config: Configured<ConfigType>
  ) => interaction is Interaction;
  execute: (
    interaction: Interaction,
    args: string[],
    config: Configured<ConfigType>
  ) => Promise<void>;
}

export function declareInteractionHandler<T extends CompatibleInteraction>(
  handler: InteractionHandler<T>
): Declared<InteractionHandler<T>> {
  return {
    type: DeclarationType.Interaction,
    ...handler,
  };
}
