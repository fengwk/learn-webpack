const path = require("node:path") // 旧的node版本为require("path")
const mergeConfig = require("./webpack.common");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const config = mergeConfig({
  mode: "production",
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({ // 压缩js
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/,
        parallel: true,
        extractComments: true // 将注释提取到单独的文件中
      })
    ],
  },
});

module.exports = config;
