const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const NODE_ENV = argv.mode || 'development';

  const entry = NODE_ENV === 'production' ? './src/plugin.ts' : './src/index.ts';

  const plugins =
    NODE_ENV === 'production'
      ? []
      : [
          new HtmlWebpackPlugin({
            title: 'EditorJs Code Playground',
            template: 'public/index.html',
          }),
        ];

  let output = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  };

  let outputForProduction = {};

  if (NODE_ENV === 'production') {
    outputForProduction = {
      library: 'CodeTool',
      libraryTarget: 'umd',
      libraryExport: 'default',
    };
  }

  output = Object.assign(output, outputForProduction)

  return {
    entry: entry,
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                eslintPath: require.resolve('eslint'),
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: '/node_modules',
        },
        {
          test: /\.s[ac]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: '/node_modules',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: output,
    plugins: plugins,
    watchOptions: {
      ignored: '**/node_modules',
    },
  };
};
