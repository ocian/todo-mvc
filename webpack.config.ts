import * as path from 'path'
import * as webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server'

interface Config {
  mode: 'development' | 'production'
  sourcemap: 'eval-source-map' | 'nosources-source-map'
  filename: string
  cssExportLoader: string
  plugins: webpack.WebpackPluginInstance[]
}

const listConfig: {
  [key: string]: Config
} = {
  development: {
    mode: 'development',
    sourcemap: 'eval-source-map',
    filename: '[name].js',
    cssExportLoader: 'style-loader',
    plugins: [],
  },
  production: {
    mode: 'production',
    sourcemap: 'nosources-source-map',
    filename: '[name].[contenthash:7].js',
    cssExportLoader: MiniCssExtractPlugin.loader,
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash:7].css',
        chunkFilename: '[id].[contenthash:7].css',
      }),
    ],
  },
}

const compiler: (env, agrs) => webpack.Configuration = (env, args) => {
  const mode = Object.keys(listConfig).includes(args.mode)
    ? args.mode
    : 'development'
  const config = listConfig[mode]

  // console.log(env, args)

  return {
    mode: config.mode,
    stats: 'minimal',
    devtool: config.sourcemap,
    resolve: { extensions: ['.tsx', '.jsx', '.ts', '.js'] },
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: config.filename,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          use: {
            loader: 'swc-loader',
            options: {
              sync: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                },
                transform: { react: { runtime: 'automatic' } },
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: [config.cssExportLoader, 'css-loader'],
        },
        {
          test: /\.s(c|a)ss$/,
          use: [config.cssExportLoader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/assets/index.html'),
      }),
      ...config.plugins,
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: { default: { filename: 'chunks/' + config.filename } },
      },
      runtimeChunk: { name: 'runtime' },
    },
  }
}

export default compiler
