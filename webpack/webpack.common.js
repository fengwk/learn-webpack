const path = require("node:path"); // 旧的node版本为require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
};

// 将obj1和obj2深度合并，如果产生冲突以obj2为主
function deepMerge (obj1, obj2) {
  var result = {};
  // 遍历obj1的属性
  for (var key in obj1) {
    if (obj1.hasOwnProperty (key)) {
      if (typeof obj1 [key] === "object" && typeof obj2 [key] === "object") {
        result [key] = deepMerge (obj1 [key], obj2 [key]);
      } else {
        result [key] = obj2 [key] || obj1 [key];
      }
    }
  }
  // 遍历obj2的属性
  for (var key in obj2) {
    if (obj2.hasOwnProperty (key)) {
      if (!result.hasOwnProperty (key)) {
        result [key] = obj2 [key];
      }
    }
  }
  return result;
}

// 导出一个合并函数用于生成新的配置信息
module.exports = function(config) {

  // 基础配置信息
  const commonConfig = {
    entry: path.resolve(__dirname, "..", "src", "index.js"),
    output: {
      filename: "[chunkhash:8].js",
      path: path.resolve(__dirname, "..", "dist"),
      assetModuleFilename: "asset/[hash:8][ext][query]"
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
    plugins: [
      new CleanWebpackPlugin(), // 自动清理构建产物
      new MiniCssExtractPlugin({
        filename: "[contenthash:8].css"
      }),
      new HtmlWebpackPlugin({ // 如果是多页面应用可以添加多个HtmlWebpackPlugin
        template: path.resolve(__dirname, "..", "src", "index.html"), // 指定模板html文件名称
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
    ]
  };

  // 合并
  return deepMerge(commonConfig, config)
}
