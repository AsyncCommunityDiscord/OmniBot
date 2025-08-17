import * as fs from "fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "path";
import type { Declared } from "../lib/declared.js";
import type { Module } from "../lib/module.js";

const __dirname = path.resolve(fileURLToPath(import.meta.url), "..", "..");
const resolve = (filePath: string): string => {
  return path.resolve(__dirname, filePath);
};

export const loadModules = async (directory: string): Promise<Module[]> => {
  const modules: Module[] = [];
  const folders = fs.readdirSync(resolve(directory));

  for (const folder of folders) {
    const modulePath = resolve(`${directory}/${folder}`);
    if (!fs.statSync(modulePath).isDirectory()) {
      continue;
    }

    const module = await loadModule(modulePath);
    if (module) {
      modules.push(module);
    } else {
      console.warn(`Module not found or invalid in path: ${modulePath}`);
    }
  }

  return modules;
};

export const loadModule = async (
  modulePath: string
): Promise<Module | null> => {
  const declaration =
    fs.readdirSync(modulePath).find((file) => file.match(/\.module\.ts$/)) ||
    fs.readdirSync(modulePath).find((file) => file.match(/\.module\.js$/));

  if (!declaration) {
    console.warn(`Module declaration not found in path: ${modulePath}`);
    return null;
  }

  const moduleFilePath = path.resolve(modulePath, declaration);

  const imported: { default: Declared<Module> } = await import(
    pathToFileURL(moduleFilePath).href
  );

  if (!imported) {
    console.warn(`Failed to import module from: ${moduleFilePath}`);
    return null;
  }

  const module = imported.default;
  if (module.type !== "module") {
    console.warn(`Invalid module type in: ${moduleFilePath}`);
    return null;
  }

  return module;
};
