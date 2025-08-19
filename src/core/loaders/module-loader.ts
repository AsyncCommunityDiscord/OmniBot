import * as fs from "fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "path";
import { DeclarationType, type Declared } from "../../lib/declared.js";
import logger from "../../lib/logger.js";
import type { Module } from "../../lib/module.js";

const __dirname = path.resolve(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  ".."
);

export async function loadModules(basePath: string): Promise<Module[]> {
  logger.info("Loading modules from base path", basePath);

  const modules: Module[] = [];
  const moduleFolder = path.resolve(__dirname, basePath);

  const moduleFolderFiles = await fs.readdir(moduleFolder, {
    withFileTypes: true,
  });

  const moduleNames = moduleFolderFiles
    .filter(
      (dirent) =>
        dirent.isDirectory() ||
        logger.warn(`Skipping non-directory module | path = ${dirent.name}`)
    )
    .map((dirent) => dirent.name);

  for (const folder of moduleNames) {
    const modulePath = path.resolve(moduleFolder, folder);
    const module = await loadModule(modulePath);

    if (module) {
      modules.push(module);
    } else {
      logger.warn(`Module not found or invalid | path = ${modulePath}`);
    }
  }

  logger.info("Finished loading modules");

  return modules;
}

export async function loadModule(modulePath: string): Promise<Module | null> {
  logger.info(`Loading module | path = ${modulePath}`);

  const moduleEntryPoint = (await fs.readdir(modulePath)).find(
    (file) => file.match(/\.module\.ts$/) || file.match(/\.module\.js$/)
  );

  if (!moduleEntryPoint) {
    logger.warn(`Module entry point not found | path = ${modulePath}`);
    return null;
  }

  const moduleFilePath = path.resolve(modulePath, moduleEntryPoint);

  const imported: { default: Declared<Module> } = await import(
    pathToFileURL(moduleFilePath).href
  );

  if (!imported) {
    logger.warn(`Failed to import module | path = ${moduleFilePath}`);
    return null;
  }

  const module = imported.default;
  if (module.type !== DeclarationType.Module) {
    logger.warn(`Invalid module | path = ${moduleFilePath}`);
    return null;
  }

  logger.info(`Module loaded successfully | id = ${module.id}`);

  return module;
}
