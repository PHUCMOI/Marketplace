const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      'shipper-mfe': {
        import: './src/index.tsx',
        library: { type: 'system' },
      },
      standalone: './src/bootstrap.tsx',
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
      publicPath: 'auto',
      globalObject: 'window',
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
          use: [
            {
              loader: 'style-loader',
              options: { attributes: { 'data-single-spa-application': 'shipper-mfe' } },
            },
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Shipper MFE - Logistics Marketplace',
        chunks: ['standalone'],
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
      runtimeChunk: false,
    },
  };
};
