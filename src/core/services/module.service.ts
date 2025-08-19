import type { Guild } from "discord.js";
import { client, modules } from "../../index.js";
import prisma from "../../lib/database.js";
import type { Module } from "../../lib/module.js";
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
      const activation = moduleActivations.find(
        (activation) => activation.moduleId === module.id
      );

      return {
        module: {
          id: module.id,
          name: module.name,
          description: module.description,
        },
        enabled: activation?.activated ?? false,
        enabledVersion: activation?.activatedVersion,
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

  async getGuildsWhereVersionDoesNotMatch(module: Module, version: string) {
    const activations = await prisma.moduleActivation.findMany({
      select: {
        guildId: true,
        activatedVersion: true,
      },
      where: {
        moduleId: module.id,
        activated: true,
        activatedVersion: {
          not: version,
        },
      },
    });

    return activations.map((activation) => ({
      guildId: activation.guildId,
      currentVersion: activation.activatedVersion,
      expectedVersion: version,
    }));
  }

  async enableModule(moduleId: string, guild: Guild) {
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
        activatedVersion: module.version,
      },
      update: {
        activated: true,
        activatedVersion: module.version,
      },
    });

    module.onInstall?.(client, guild, module.registry);

    return activation;
  }

  async disableModule(moduleId: string, guild: Guild) {
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
        activatedVersion: "",
      },
      update: {
        activated: false,
        activatedVersion: "",
      },
    });

    module.onUninstall?.(client, guild, module.registry);

    return activation;
  }

  async updateModuleActivation(
    moduleId: string,
    guildId: string,
    version: string
  ) {
    await prisma.moduleActivation.update({
      where: {
        moduleId_guildId: {
          moduleId,
          guildId,
        },
      },
      data: {
        activatedVersion: version,
      },
    });
  }
}

export default declareService(new ModuleService());
