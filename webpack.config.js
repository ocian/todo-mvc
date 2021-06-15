const HTMLWebpackPlugin = require('html-webpack-plugin')

const mode = process.env.MODE || 'development'
const filename = mode === 'development' ? '[name].js' : '[name].[contenthash:7].js'
const sourceMap =
  mode === 'development' ? 'eval-source-map' : 'nosources-source-map'

module.exports = {
  mode,
  devtool: sourceMap,
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.tsx', '.js'],
  },
  devServer: { historyApiFallback: true, port: process.env.PORT || '8080' },
  entry: './src/index.tsx',
  output: {
    filename,
    clean: true,
  },
  plugins: [
    new HTMLWebpackPlugin({ template: './src/assets/index.html' }),
  ],
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
    ]
  }
}
