module.exports = {
  mode: "production",
  entry: [__dirname + "/src/NavigoReact.tsx"],
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
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
  },
  output: {
    path: `${__dirname}/lib`,
    publicPath: "/",
    filename: "NavigoReact.min.js",
  },
  externals: {
    react: "react",
  },
};
