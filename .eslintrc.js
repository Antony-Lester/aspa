module.exports = {
  root: true,
  extends: '@react-native',
  "env": {
    "browser": true,
    "es2020": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/no-unused-vars": "off", 
    "@typescript-eslint/no-var-requires": "off", 
    "@typescript-eslint/no-explicit-any": "off", 
    "no-dupe-keys": "off", 
    "no-mixed-spaces-and-tabs": "off" 
  }
};
