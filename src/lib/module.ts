import type { Declared } from "./declared.js";

export interface Module {
  id: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;
  init: () => void;
  destroy: () => void;
}

export const defineModule = (module: Module): Declared<Module> => {
  return {
    type: "module",
    ...module,
  };
};
