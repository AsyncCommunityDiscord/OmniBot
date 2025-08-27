import { type Config, Configured } from "../../lib/config.js";
import type { Module } from "../../lib/module.js";
import { declareService } from "../../lib/service.js";

class ConfigService {
  async getConfigForModuleIn<ConfigType extends Config>(
    _: Module<ConfigType>,
    __: string
  ): Promise<Configured<ConfigType>> {
    return new Configured();
  }
}

export default declareService(new ConfigService());
