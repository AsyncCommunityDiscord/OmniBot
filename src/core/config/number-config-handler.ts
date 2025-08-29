import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type ButtonInteraction,
  type MessageComponentBuilder,
} from "discord.js";
import {
  ConfigType,
  type ConfigProvider,
  type ConfigSchema,
} from "../../lib/config.js";
import type { Module } from "../../lib/module.js";
import type { Registry } from "../../lib/registry.js";
import { ConfigTypeHandler } from "./config-type-handler.js";

export default class NumberConfigHandler extends ConfigTypeHandler<ConfigType.NUMBER> {
  constructor() {
    super(ConfigType.NUMBER);
  }

  public override async replyToEditRequest<TSchema extends ConfigSchema>(
    interaction: ButtonInteraction,
    module: Module<TSchema>,
    config: ConfigProvider<TSchema>,
    key: string
  ): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId(`set-config-number-modal:${module.id}:${key}`)
      .setTitle(`Set ${key}`)
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("value")
            .setLabel(`Enter a value (number):`)
            .setValue(config.get(key).toString())
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
  }

  public override editionSection<TSchema extends ConfigSchema>(
    _module: Module<TSchema>,
    _configuration: ConfigProvider<TSchema>,
    _key: string
  ): Promise<MessageComponentBuilder> {
    throw new Error("Method not implemented.");
  }
  public override async registerEditionInteractionHandlers(
    _registry: Registry
  ): Promise<void> {}
}
