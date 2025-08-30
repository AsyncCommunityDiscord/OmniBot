import {
  ActionRowBuilder,
  ButtonInteraction,
  ContainerBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  ConfigProvider,
  ConfigType,
  type ConfigSchema,
} from "../../lib/config.js";
import type { Module } from "../../lib/module.js";
import type { Registry } from "../../lib/registry.js";
import { ConfigTypeHandler } from "./config-type-handler.js";

export default class StringConfigHandler extends ConfigTypeHandler<ConfigType.STRING> {
  constructor() {
    super(ConfigType.STRING);
  }

  public override async replyToEditRequest<TSchema extends ConfigSchema>(
    interaction: ButtonInteraction,
    module: Module<TSchema>,
    config: ConfigProvider<TSchema>,
    key: string
  ): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId(`set-string-config-modal:${module.id}:${key}`)
      .setTitle(`Set ${key}`)
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("value")
            .setLabel(`Enter a value (text):`)
            .setStyle(TextInputStyle.Short)
            .setValue(config.get(key).toString())
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
  }

  public override editionSection<TSchema extends ConfigSchema>(
    _module: Module<TSchema>,
    _configuration: ConfigProvider<TSchema>,
    _key: keyof TSchema
  ): Promise<ContainerBuilder> {
    throw new Error("Method not implemented.");
  }

  public override async registerEditionInteractionHandlers(
    _registry: Registry
  ): Promise<void> {}
}
