const path = require("node:path");
const mergeConfig = require("./webpack.common");
const webpack = require("webpack");

const config = mergeConfig({
  mode: "development",
  devServer: {
    static: { // 指定服务器文件基础的目录
      directory: path.join(__dirname, "dist"),
    },
    port: 9090, // 指定服务端口
    hot: true // 使用热更新
  },
  devtool: "source-map", // 便于代码调试
  performance: {
    maxEntrypointSize: 1024 * 1024 * 1, // 设置最大入口文件的大小，超出会警告
    maxAssetSize: 1024 * 1024 * 1 // 设置最大资源文件的大小，超出会警告
  }
});

config.plugins.push(new webpack.HotModuleReplacementPlugin()); // 热更新插件

module.exports = config;
