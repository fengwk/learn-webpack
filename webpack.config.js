const path = require("node:path") // 旧的node版本为require("path")
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        [
          'autoprefixer',
          {
            overrideBrowserslist: [
              '> 1%',
              'last 2 versions'
            ]
          },
        ],
      ],
    },
  },
};
const px2remLoader = {
  loader: "px2rem-loader",
  options: {
    remUnit: 75, // 代表1个rem为75px
    remPrecesion: 8 // px转为rem时小数点后保留的位数
  }
}

module.exports = {
  // mode: "development",
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle_[chunkhash:8].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "asset/[name]_[hash:8][ext][query]"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          postcssLoader,
          px2remLoader
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          postcssLoader,
          px2remLoader
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource"
      }
    ]
  },
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
  plugins: [
    new CleanWebpackPlugin(), // 自动清理构建产物
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css"
    }),
    new HtmlWebpackPlugin({ // 如果是多页面应用可以添加多个HtmlWebpackPlugin
      template: path.join(__dirname, "src/index.html"), // 指定模板html文件名称
      filename: "index.html", // 指定生成的html文件名称
      // chunks: ["index"], // 指定要插入的chunk
      inject: "body", // 将js文件插入到body之后
      title: "MyApp", // 标题，将注入到模板当中
      minify: { // 压缩html
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  ],
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
}
