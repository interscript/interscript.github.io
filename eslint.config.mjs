// @ts-check
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import astro from "eslint-plugin-astro"
import vue from "eslint-plugin-vue"
import prettierConfig from "eslint-config-prettier"
import globals from "globals"

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "public/**",
      "_legacy-content/**",
      "docs/**",
      "posts/**",
      "map/**",
      "TODO.complete/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  vue.configs["flat/essential"],
  prettierConfig,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // The ISC JSON IR and catalogue entries are untyped by design.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    files: ["**/*.astro", "**/*.ts"],
    rules: {
      // tsc (astro check) owns undefined-variable detection; the
      // Astro frontmatter processor trips no-undef on TS globals.
      "no-undef": "off",
    },
  },
)
