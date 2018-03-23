const path = require( 'path' )
const eslintFriendlyFormatter = require( 'eslint-friendly-formatter' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const autoprefixer = require( 'autoprefixer' )

module.exports = {
  cache: true,
  context: path.resolve( __dirname, '..' ),
  devtool: 'eval',
  entry: {
    app: './src/scripts/index.js'
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'app.bundle.js',
    pathinfo: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [ {
          loader: 'eslint-loader',
          options: {
            parser: 'babel-eslint',
            formatter: eslintFriendlyFormatter,
            cacheDirectory: true
          }
        } ]
      },
      {
        test: /\.js$/,
        use: [ {
          loader: 'babel-loader'
        } ],
        exclude: [ /node_modules/ ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
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
  devServer: {
    contentBase: path.resolve( __dirname, 'static' ),
    compress: false,
    port: 3000,
    stats: 'verbose',
    historyApiFallback: true,
    host: '0.0.0.0'
  },
  plugins: [
    new HtmlWebpackPlugin( {
      template: 'src/index.tpl.ejs',
      inject: 'body',
      filename: 'index.html',
      hash: true,
      environment: process.env.NODE_ENV
    } ),
    new CopyWebpackPlugin( [ { from: 'static' } ], { ignore: [ '.DS_Store', '.keep' ] } )
  ]
}
