const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  watch: true,
  entry: [__dirname + "/src/index.tsx"],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(js|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "navigo-react$": path.resolve(__dirname + "/../../src/NavigoReact.tsx"),
    },
  },
  output: {
    path: `${__dirname}/public`,
    publicPath: "/",
    filename: "app.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    liveReload: true,
    port: 3000,
    historyApiFallback: true,
    writeToDisk: true,
  },
};
