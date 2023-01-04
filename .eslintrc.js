module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ['.eslintrc.js', 'webpack.config.js'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
    "semi": ["error", "never"],
    "prettier/prettier": ["error", {"singleQuote": true, "semi": false, "endOfLine": 'auto',}],
    "prefer-const": ["off", {
        "destructuring": "any",
        "ignoreReadBeforeAssign": true
    }],
  }
};
