import { ButtonStyle, ContainerBuilder } from "discord.js";
import { Colors } from "../../utils/colors.js";
import type moduleService from "../services/module.service.js";

export const modulesMessage = (
  modulesState: Awaited<ReturnType<typeof moduleService.getAllModulesStateIn>>
) => {
  const container = new ContainerBuilder().setAccentColor(Colors.Turquoise);
  container.addTextDisplayComponents(
    (text) => text.setContent("# Modules"),
    (text) =>
      text.setContent(
        "The modules marked with ✅ are enabled, while those marked with ❌ are disabled."
      )
  );
  container.addSeparatorComponents((separator) => separator.setDivider(true));

  for (let state of modulesState) {
    const emoji = state.enabled ? "✅" : "❌";

    container.addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) =>
          text.setContent(
            `${emoji} \`${state.module.name}\`${state.enabled ? ` (${state.enabledVersion})` : ""}\n> ${state.module.description}`
          )
        )
        .setButtonAccessory((button) =>
          button
            .setCustomId(
              state.enabled
                ? "disable-module:" + state.module.id
                : "enable-module:" + state.module.id
            )
            .setLabel(state.enabled ? "Disable" : "Enable")
            .setStyle(state.enabled ? ButtonStyle.Danger : ButtonStyle.Success)
        )
    );
  }

  return container;
};
