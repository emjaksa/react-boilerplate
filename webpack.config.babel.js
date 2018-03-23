import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default (env, config) => {
  console.log(`MODE=${config.mode}`)
  console.log(`HOT=${config.hot}`)
  const DEV = config.mode !== 'production'
  console.log(`DEV=${DEV}`)

  const extractAppStyles = new ExtractTextPlugin({
    filename: DEV
      ? 'styles/[name].[hash].css'
      : 'styles/[name].[chunkhash].css',
    disable: config.hot,
    // allChunks: true,
  })

  const cssLoaderOptions = {
    modules: true,
    importLoaders: DEV ? 1 : 0,
    sourceMap: DEV,
    minimize: !DEV,
    localIdentName: DEV ? '[name]__[local]--[hash:base64:5]' : '[hash:base64]',
  }

  const sassLoaderOptions = {
    sourceMap: DEV,
    includePaths: [path.resolve(__dirname, './src/sass/')],
    data: '@import "_mixins.scss";@import "_variables.scss";',
  }

  const babelPlugins = [
    'transform-decorators-legacy',
    // // ['relay', { schema: path.resolve(BUILD_PATH, './schema.json') }],
    'lodash',
  ]
  const babelPresets = [
    '@babel/preset-stage-2',
    '@babel/preset-react',
    ...(DEV ? [] : ['react-optimize']),
  ]
  const babelEnvSettings = {
    modules: false,
    useBuiltIns: 'entry',
    debug: false,
  }

  return {
    name: 'client',
    entry: [
      'normalize.css',
      '@babel/polyfill',
      'whatwg-fetch',
      'url-search-params-polyfill',
      './src/client.js',
    ],
    target: 'web',
    devtool: DEV ? 'source-map' : false,
    devServer: {
      hot: config.hot,
      overlay: true,
      stats: {
        colors: true,
        modules: !DEV,
      },
      port: 3000,
    },
    output: {
      filename: DEV
        ? 'scripts/[name].[hash].js'
        : 'scripts/[name].[chunkhash].js',
      path: path.join(__dirname, 'build'),
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            // cacheDirectory: DEV,
            plugins: babelPlugins,
            presets: [
              [
                '@babel/preset-env',
                {
                  ...babelEnvSettings,
                },
              ],
              ...babelPresets,
            ],
          },
        },
        {
          test: /\.(css|scss|sass)$/,
          // exclude: /node_modules/,
          use: extractAppStyles.extract({
            fallback: {
              loader: 'style-loader',
              options: {
                hmr: config.hot,
                sourceMap: DEV,
              },
            },
            use: [
              {
                loader: 'css-loader', // translates CSS into CommonJS
                options: cssLoaderOptions,
              },
              // {
              //   loader: 'postcss-loader',
              //   options: {
              //     sourceMap: DEV,
              //     plugins: [PostcssCssnextPlugin(), PostcssFlexbugsFixes()],
              //   },
              // },
              // {
              //   loader: 'sass-loader', // compiles Sass to CSS
              //   options: sassLoaderOptions,
              // },
            ],
          }),
        },
      ],
    },
    plugins: [
      extractAppStyles,
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async',
      }),
    ],
  }
}
