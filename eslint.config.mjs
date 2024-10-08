import globals from "globals";
import pluginJs from "@eslint/js";
<<<<<<< HEAD
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "no-console": "off",
      quotes: ["error", "double"],
      "max-len": [
        "error",
        {
          code: 90,
        },
      ],
    },
  },
];
=======


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];
>>>>>>> b14e0c0abfd50fc384901bc5719d69f1d0c590e3
