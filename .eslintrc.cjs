module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: ["eslint:recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", "node_modules"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
  plugins: ["react", "react-refresh"],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^[A-Z_]+$" }],
    "react/jsx-uses-vars": "error",
    "react-refresh/only-export-components": "off",
  },
};
