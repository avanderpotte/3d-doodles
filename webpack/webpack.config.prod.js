const webpack = require( 'webpack' )
const path = require( 'path' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' )
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' )
const autoprefixer = require( 'autoprefixer' )

module.exports = {
  context: path.resolve( __dirname, '..' ),
  entry: {
    app: './src/scripts/index.js'
  },
  output: {
    filename: 'app.min.js',
    path: path.resolve( __dirname, '..', 'dist' )
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract( {
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer( { browsers: [ 'last 2 versions' ] } )
                ]
              }
            },
            'stylus-loader'
          ]
        } )
      },
      {
        test: /\.(png|svg|jpg)$/,
        use: 'file-loader?name=image/[name].[ext]'
      },
      {
        test: /node_modules/,
        loader: 'ify-loader'
      },
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify'
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve( __dirname, '..', 'src/scripts' ),
      'node_modules'
    ],
    extensions: [ '.js' ],
    alias: {
      Config: path.resolve( __dirname, '../src/scripts/config/' ),
      Core: path.resolve( __dirname, '../src/scripts/core/' ),
      Utils: path.resolve( __dirname, '../src/scripts/utils/' )
    }
  },
  plugins: [
    new HtmlWebpackPlugin( {
      template: 'src/index.tpl.ejs',
      inject: 'body',
      filename: 'index.html',
      hash: true,
      environment: process.env.NODE_ENV
    } ),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin( {
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    } ),
    new CopyWebpackPlugin( [ { from: 'static' } ], { ignore: [ '.DS_Store', '.keep' ] } ),
    new UglifyJSPlugin( {
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true,
          pure_funcs: [ 'console.log' ]
        }
      }
    } ),
    new ExtractTextPlugin( { filename: 'app.min.css', allChunks: true } ),
    new OptimizeCssAssetsPlugin(),
    new CleanWebpackPlugin( [ 'dist' ], { root: path.join( __dirname, '..' ) } )
  ]
}
