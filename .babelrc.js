module.exports = {
  presets: [
    ['@babel/preset-env', { targets: '> 0.25%, not dead', modules: false, loose: true }],
    '@babel/preset-typescript',
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
