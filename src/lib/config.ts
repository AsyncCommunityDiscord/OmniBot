import { CategoryChannel, type Channel, Role, type User } from "discord.js";

export enum ConfigEntryType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  USER = "USER",
  CATEGORY = "CATEGORY",
  CHANNEL = "CHANNEL",
  ROLE = "ROLE",
}

export const ConfigEntryChecker: Record<
  ConfigEntryType,
  (value: string) => boolean
> = {
  STRING: () => true,
  NUMBER: (value: string) => !isNaN(Number(value)),
  BOOLEAN: (value: string) =>
    value.toLowerCase() === "true" || value.toLowerCase() === "false",
  USER: (value: string) => /^<@!?(\d+)>$/.test(value),
  ROLE: (value: string) => /^<@&(\d+)>$/.test(value),
  CHANNEL: (value: string) => /^<#(\d+)>$/.test(value),
  CATEGORY: (value: string) => /^<#(\d+)>$/.test(value),
};

export type ConfigList<T extends ConfigEntryType> = [T];

export interface ConfigEntry {
  name: string;
  description: string;
  type: ConfigEntryType | ConfigList<ConfigEntryType>;
}

export type Config = Record<string, ConfigEntry>;

// Table de correspondance des types
export interface ConfigTypeMap {
  [ConfigEntryType.STRING]: string;
  [ConfigEntryType.NUMBER]: number;
  [ConfigEntryType.BOOLEAN]: boolean;
  [ConfigEntryType.USER]: User;
  [ConfigEntryType.ROLE]: Role;
  [ConfigEntryType.CHANNEL]: Channel;
  [ConfigEntryType.CATEGORY]: CategoryChannel;
}

export class Configured<T extends Config> {
  get<Key extends keyof T>(
    key: Key
  ): T[Key] extends { type: ConfigList<infer U> }
    ? ConfigTypeMap[U][]
    : T[Key] extends { type: infer U extends ConfigEntryType }
      ? ConfigTypeMap[U]
      : never {
    throw new Error(`Method not implemented. | key = ${key.toString()}`);
  }
}
