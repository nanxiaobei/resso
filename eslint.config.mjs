export default {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: { node: true, es2020: true },
  rules: {
    '@typescript-eslint/no-shadow': 'error',
  },
};
