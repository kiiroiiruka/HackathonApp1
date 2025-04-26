const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: ["dist"], // 無視するファイル・ディレクトリ
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: tsParser, // 修正: パーサーを正しい形式で指定
      globals: {
        browser: true,
        node: true,
        es2021: true, // ES2021のグローバル変数を有効化
        process: "readonly", // processをグローバルとして定義
        console: "readonly", // consoleをグローバルとして定義
        window: 'readonly', // グローバル変数を定義
        localStorage: 'readonly',
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
      react: require("eslint-plugin-react"),
      "react-native": require("eslint-plugin-react-native"),
    },
    settings: {
      react: {
        version: "detect", // Reactバージョンを自動検出
      },
    },
    rules: {
      // 必要なルールを手動で定義
      "no-unused-vars": ["warn", { vars: "all", args: "none", ignoreRestSiblings: true }], // 未使用変数の警告を調整
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",
      "prettier/prettier": "error", // Prettierルールを適用
      // カスタムルール
      "prefer-const": "error",
      "prefer-template": "error",
      "arrow-body-style": "off", 
      "no-multiple-empty-lines": ["error", { max: 2 }],
      "no-mixed-spaces-and-tabs": "error",
    },
  },
];
