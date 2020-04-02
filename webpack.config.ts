import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";

const config: webpack.Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  entry: {
    module: [path.join(__dirname, "examples/src/index.tsx"), "webpack-dev-server/client?http://localhost:8080"]
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "examples/dist"),
    publicPath: "/"
  },
  devServer: {
    host: "localhost",
    port: 8080,
    inline: true,
    liveReload: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "examples/src/index.ejs"
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        //include: path.join(__dirname, "src"),
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
};

export default config;
