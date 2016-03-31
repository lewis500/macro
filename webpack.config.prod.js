var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'source-map',
  entry: [
    './app/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }, {
      test: /\.css$/,
      loaders: ["style", "css"]
    }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css', '.json']
  }
  // module: {
  //   loaders: [{
  //     test: /\.js$/,
  //     loaders: ['babel'],
  //     include: path.join(__dirname, 'src')
  //   }]
  // }
};