import * as fs from "fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "path";
import { DeclarationType, type Declared } from "../../lib/declared.js";
import type { Module } from "../../lib/module.js";

const __dirname = path.resolve(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  ".."
);

export async function loadModules(basePath: string): Promise<Module[]> {
  const modules: Module[] = [];
  const moduleFolder = path.resolve(__dirname, basePath);

  const moduleFolderFiles = await fs.readdir(moduleFolder, {
    withFileTypes: true,
  });

  const moduleNames = moduleFolderFiles
    .filter(
      (dirent) =>
        dirent.isDirectory() ||
        console.warn(`Skipping non-directory module | path = ${dirent.name}`)
    )
    .map((dirent) => dirent.name);

  for (const folder of moduleNames) {
    const modulePath = path.resolve(moduleFolder, folder);
    const module = await loadModule(modulePath);

    if (module) {
      modules.push(module);
    } else {
      console.warn(`Module not found or invalid | path = ${modulePath}`);
    }
  }

  return modules;
}

export async function loadModule(modulePath: string): Promise<Module | null> {
  const moduleEntryPoint = (await fs.readdir(modulePath)).find(
    (file) => file.match(/\.module\.ts$/) || file.match(/\.module\.js$/)
  );

  if (!moduleEntryPoint) {
    console.warn(`Module entry point not found | path = ${modulePath}`);
    return null;
  }

  const moduleFilePath = path.resolve(modulePath, moduleEntryPoint);

  const imported: { default: Declared<Module> } = await import(
    pathToFileURL(moduleFilePath).href
  );

  if (!imported) {
    console.warn(`Failed to import module | path = ${moduleFilePath}`);
    return null;
  }

  const module = imported.default;
  if (module.type !== DeclarationType.Module) {
    console.warn(`Invalid module | path = ${moduleFilePath}`);
    return null;
  }

  return module;
}
