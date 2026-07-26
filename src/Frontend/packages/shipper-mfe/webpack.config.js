const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'shipperMfe',
        filename: 'remoteEntry.js',
        exposes: {
          './ShipperApp': './src/ShipperApp.tsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: false,
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.20.0',
            eager: false,
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Shipper MFE - Logistics Marketplace',
      }),
    ],
    devServer: {
      port: 3003,
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    optimization: {
      minimize: isProduction,
      splitChunks: false,
    },
  };
};