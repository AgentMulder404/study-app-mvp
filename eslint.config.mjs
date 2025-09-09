import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReactConfig,
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    // General rules to improve quality
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with Next.js
      "react/prop-types": "off", // We use TypeScript for prop types
      "no-unused-vars": "warn", // Warn about unused variables instead of erroring
    },
  },
];