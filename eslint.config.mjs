import pluginJs from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  globalIgnores([".astro", "node_modules", "dist", "build", "out"]),
  pluginJs.configs.recommended,

  /* optional */
  importPlugin.flatConfigs.recommended,

  ...tseslint.configs.recommended,

  /* optional */
  {
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
    },
  },
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  ...eslintPluginAstro.configs["all"],

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser },
    },
  },

  /* optional */
  {
    settings: {
      "import/resolver": {
        typescript: {},
      },
    },
  },

  {
    files: ["*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: typescriptEslintParser,
        extraFileExtensions: [".astro"],
      },
    },
  },

  /* optional */
  eslintConfigPrettier,

  {
    rules: {
      "import/no-unresolved": "off",
      "astro/no-unused-css-selector": "off",
    },
  },
];
