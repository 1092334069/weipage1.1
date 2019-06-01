const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');

const pageUrl = require('./pageUrl.js');

module.exports = {
  entry: pageUrl.getEntry(),
  devtool: 'inline-source-map',
  plugins: [
      new webpack.DefinePlugin({
        'process.evn':{
          NODE_ENV:"Development"
        }
      }),
      new CleanWebpackPlugin(['/dist']),
      new HtmlWebpackPlugin(
      {
        title: 'Development'
      })
      // ,
      // new uglify()
  ],
  output: pageUrl.getOutput(),  
  devServer: {
    contentBase: __dirname
  },
  module: {
     rules: [
        {
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          use: ['html-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }]
        },
       {
          test: require.resolve('jquery'),
          use: [{
              loader: 'expose-loader',
              options: 'jQuery'
          },{
              loader: 'expose-loader',
              options: '$'
          }]
        },
        {
          test: require.resolve('vue'),
          use: [{
              loader: 'expose-loader',
              options: 'Vue'
          }]
        }
     ]
  }
};