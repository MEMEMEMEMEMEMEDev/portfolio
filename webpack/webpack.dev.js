const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",

  devtool: "eval-source-map",

  devServer: {
    static: path.resolve(__dirname, "../dist"),
    hot: true,
    historyApiFallback: true,
    port: 3040,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },

  output: {
    filename: "[name].js",
  },
});
