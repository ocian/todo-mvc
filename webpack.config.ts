import * as path from "path";
import * as webpack from "webpack";
import type {} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import "webpack-dev-server";

interface Config {
  mode: "development" | "production";
  sourcemap: "eval-source-map" | "nosources-source-map";
  filename: string;
  cssInsertLoader: string;
  plugins: webpack.WebpackPluginInstance[];
  // minimizer: webpack.Configuration["optimization"]["minimizer"];
  minimizer: any[];
}

const listConfig: {
  [key: string]: Config;
} = {
  development: {
    mode: "development",
    sourcemap: "eval-source-map",
    filename: "[name].js",
    cssInsertLoader: "style-loader",
    plugins: [],
    minimizer: [],
  },
  production: {
    mode: "production",
    sourcemap: "nosources-source-map",
    filename: "js/[name].[contenthash:7].js",
    cssInsertLoader: MiniCssExtractPlugin.loader,
    plugins: [
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:7].css",
        chunkFilename: "[id].[contenthash:7].css",
      }),
    ],
    minimizer: [new CssMinimizerPlugin()],
  },
};

const getCssLoaderConfig = (mode: "development" | "production") => ({
  loader: "css-loader",
  options: {
    modules: {
      localIdentName:
        mode === "development" ? "[path][name]__[local]" : undefined,
    },
  },
});

const compiler: (env, agrs) => webpack.Configuration = (env, args) => {
  const mode = Object.keys(listConfig).includes(args.mode)
    ? args.mode
    : "development";
  const config = listConfig[mode];

  // console.log(env, args)

  return {
    mode: config.mode,
    stats: "minimal",
    devtool: config.sourcemap,
    resolve: { extensions: [".tsx", ".jsx", ".ts", ".js"] },
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: config.filename,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          use: {
            loader: "swc-loader",
            options: {
              sync: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                  dynamicImport: true,
                },
                transform: { react: { runtime: "automatic" } },
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: [config.cssInsertLoader, getCssLoaderConfig(config.mode)],
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            config.cssInsertLoader,
            getCssLoaderConfig(config.mode),
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./src/assets/index.html"),
      }),
      ...config.plugins,
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        // cacheGroups: { default: { filename: "chunks/" + config.filename } },
      },
      runtimeChunk: { name: "runtime" },
      minimizer: ["...", ...config.minimizer],
    },
  };
};

export default compiler;
