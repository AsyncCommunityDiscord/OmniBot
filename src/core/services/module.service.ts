import type { Guild } from "discord.js";
import { client, modules } from "../../index.js";
import prisma from "../../lib/database.js";
import { declareService, type Service } from "../../lib/service.js";

class ModuleService implements Service {
  getAllModules() {
    return modules;
  }

  async getAllModulesStateIn(guildId: string) {
    const moduleActivations = await prisma.moduleActivation.findMany({
      where: { guildId },
    });

    return modules.map((module) => {
      const activation =
        moduleActivations.find(
          (activation) => activation.moduleId === module.id
        )?.activated ?? false;

      return {
        module: {
          id: module.id,
          name: module.name,
          description: module.description,
        },
        enabled: activation,
      };
    });
  }

  async getModuleStateIn(moduleId: string, guild: Guild) {
    return this.getModuleStateFromGuildIdIn(moduleId, guild.id);
  }

  async getModuleStateFromGuildIdIn(moduleId: string, guildId: string) {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }

    const state = await prisma.moduleActivation.findFirst({
      where: {
        moduleId,
        guildId,
      },
    });

    return state ?? { moduleId, guildId, activated: false };
  }

  async installModule(moduleId: string, guild: Guild) {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }

    // Create a new activation record
    const activation = await prisma.moduleActivation.upsert({
      where: {
        moduleId_guildId: {
          moduleId,
          guildId: guild.id,
        },
      },
      create: {
        moduleId,
        guildId: guild.id,
        activated: true,
      },
      update: {
        activated: true,
      },
    });

    module.onInstall?.(client, guild, module.registry);

    return activation;
  }

  async uninstallModule(moduleId: string, guild: Guild) {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }

    const activation = await prisma.moduleActivation.upsert({
      where: {
        moduleId_guildId: {
          moduleId,
          guildId: guild.id,
        },
      },
      create: {
        moduleId,
        guildId: guild.id,
        activated: false,
      },
      update: {
        activated: false,
      },
    });

    module.onUninstall?.(client, guild, module.registry);

    return activation;
  }
}

export default declareService(new ModuleService());
