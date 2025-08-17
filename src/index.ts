import { loadModules } from "./loader/loader.js";

loadModules("./modules").then((modules) => {
  console.log("Loaded modules:", modules);
});
