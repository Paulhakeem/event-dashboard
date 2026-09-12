import { defineNuxtModule } from "nuxt/kit";
import { resolve } from "path";

export default defineNuxtModule({
  meta: {
    name: "@velora/shared",
    configKey: "veloraShared",
  },
  setup(_options, nuxt) {
    const composablesDir = resolve(import.meta.dirname, "composables");
    const componentsDir = resolve(import.meta.dirname, "components");

    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({ path: componentsDir, global: true });
    });

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(composablesDir);
    });
  },
});