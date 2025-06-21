import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginNode from "eslint-plugin-n";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      node: pluginNode,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "n/no-unsupported-features/es-syntax": "off",
    },
  },
];