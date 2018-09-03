var webpack = require("webpack"),
  path = require("path"),
  env = require("./utils/env"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  WriteFilePlugin = require("write-file-webpack-plugin");

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

var options = {
  mode: "development",
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    background: path.join(__dirname, "src", "js", "background.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [{
      test: /\.css$/,
      loader: "style-loader!css-loader",
    }, {
      test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
      loader: "file-loader?name=[name].[ext]",
    }, {
      test: /\.html$/,
      loader: "html-loader",
    }]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
    },
  },
  performance: {
    hints: "warning", // enum    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function (assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map",
  context: __dirname,
  target: "web",
  externals: [],
  serve: {
    port: 1337,
    content: './dist',
  },
  stats: "errors-only",
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
  },
 plugins: [
   new CleanWebpackPlugin(["dist"]),
   new webpack.DefinePlugin({
     "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
   }),
   new CopyWebpackPlugin([{
     from: "src/manifest.json",
     transform: function (content, path) {
       return Buffer.from(JSON.stringify({
         description: process.env.npm_package_description,
         version: process.env.npm_package_version,
         ...JSON.parse(content.toString())
       }))
     }
   }]),
   new HtmlWebpackPlugin({
     template: path.join(__dirname, "src", "popup.html"),
     filename: "popup.html",
     chunks: ["popup"]
   }),
   new HtmlWebpackPlugin({
     template: path.join(__dirname, "src", "options.html"),
     filename: "options.html",
     chunks: ["options"]
   }),
   new HtmlWebpackPlugin({
     template: path.join(__dirname, "src", "background.html"),
     filename: "background.html",
     chunks: ["background"]
   }),
   new WriteFilePlugin()
 ]
}

module.exports = options
