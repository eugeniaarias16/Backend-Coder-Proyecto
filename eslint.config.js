import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"] },  // Asegúrate de que se aplique a todos tus archivos JS
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      "semi": ["error", "always"]  // regla que exige punto y coma
    }
  }
];