import js from "@eslint/js";
import globals from "globals";

const browserGlobals = {
  ...globals.browser,
  $: "readonly",
  api: "readonly",
  Blob: "readonly",
  capitalize: "readonly",
  Chartist: "readonly",
  CKEDITOR: "readonly",
  csrf_token: "readonly",
  Datamap: "readonly",
  errorFlash: "readonly",
  errorFlashFade: "readonly",
  escapeHtml: "readonly",
  Highcharts: "readonly",
  location: "readonly",
  modalError: "readonly",
  moment: "readonly",
  Papa: "readonly",
  successFlash: "readonly",
  successFlashFade: "readonly",
  Swal: "readonly",
  unescapeHtml: "readonly",
  UAParser: "readonly",
};

export default [
  {
    ignores: ["static/js/dist/**", "static/js/src/vendor/**"],
  },
  {
    files: ["build-assets.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["static/js/src/app/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: browserGlobals,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-redeclare": "warn",
      "no-unreachable": "warn",
      "no-useless-assignment": "warn",
    },
  },
  {
    files: ["static/js/src/app/passwords.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: browserGlobals,
    },
  },
];
