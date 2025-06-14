module.exports = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        helpers: true,
        regenerator: true,
        useESModules: false,
      }]
    ]
  }
  