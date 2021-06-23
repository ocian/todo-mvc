const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path')

const mode = process.env.MODE || 'development'
const filename =
  mode === 'development' ? '[name].js' : '[name].[contenthash:7].js'
const filenameAssets =
  mode === 'development'
    ? '[name].[ext][query]'
    : '[name].[contenthash:7][ext][query]'
const sourceMap =
  mode === 'development' ? 'eval-source-map' : 'nosources-source-map'
const cssExportLoader =
  mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'
const pluginsProduction =
  mode === 'production' ? [new MiniCssExtractPlugin()] : []
const optimization =
  mode === 'production'
    ? { minimizer: ['...', new CssMinimizerPlugin()] }
    : undefined

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[local]--[hash:base64:5]',
      auto: /\.module\.\w+$/i,
    },
  },
}

module.exports = {
  mode,
  devtool: sourceMap,
  optimization,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  devServer: { historyApiFallback: true, port: process.env.PORT || '8080' },
  entry: './src/index.tsx',
  output: {
    filename,
    clean: true,
  },
  plugins: [
    new HTMLWebpackPlugin({ template: './src/assets/index.html' }),
  ].concat(pluginsProduction),
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: {
          loader: 'swc-loader',
          options: {
            sync: true,
            jsc: {
              parser: { syntax: 'typescript', tsx: true, dynamicImport: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
      },
      {
        test: /\.s(c|a)ss$/,
        use: [cssExportLoader, CSSLoader, 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [cssExportLoader, CSSLoader],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/' + filenameAssets,
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/' + filenameAssets,
        },
      },
    ],
  },
}
