var path = require('path');
var webpack = require('webpack');
var serverConfig = require('./server.config');

module.exports = {
  devtool: 'eval',
  entry: [
    `webpack-dev-server/client?http://${serverConfig.HOST}:${serverConfig.PORT}`,
    'webpack/hot/only-dev-server',
    './app/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      API_URL: process.env.API_URL,
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV) }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'app'),
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'autoprefixer', 'sass-loader'],
        include: path.join(__dirname, 'app'),
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2|otf|ico)(\?(.)+)?$/,
        loaders: ['file']
      },
    ]
  },
    resolve: {
    root: path.resolve(__dirname),
     alias: {
       actions: 'app/actions',
       components: 'app/components',
       constants: 'app/constants',
       helpers: 'app/helpers',
       reducers: 'app/reducers',
     },
     extensions: ['', '.js', '.scss'],
  }
};
