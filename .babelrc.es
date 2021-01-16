{
  "ignore": ["node_modules/**/*"],
  "presets": [
    ["@babel/preset-typescript"],
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": ["@babel/plugin-transform-regenerator", "@babel/plugin-transform-runtime"]
}
