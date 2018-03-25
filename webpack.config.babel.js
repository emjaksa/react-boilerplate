import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackShellPlugin from 'webpack-shell-plugin'
import nodeExternals from 'webpack-node-externals'
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin'
import dotenv from 'dotenv'

dotenv.config()

const { PORT = 8080, DEV_PORT = 3000 } = process.env
const BUILD_PATH = path.join(__dirname, 'build')

export default (env, config) => {
  const configName = config.configName
    ? config.configName.toUpperCase()
    : 'BUILD'
  const logVariable = (key, value) =>
    // eslint-disable-next-line no-console
    console.log(`${configName}_${key}=${value}`)
  logVariable('MODE', config.mode)
  logVariable('HOT', config.hot)
  const DEV = config.mode !== 'production'
  logVariable('DEV', DEV)
  logVariable('NODE_ENV', process.env.NODE_ENV)

  const extractAppStyles = new ExtractTextPlugin({
    filename: DEV
      ? 'styles/[name].[hash].css'
      : 'styles/[name].[chunkhash].css',
    disable: config.hot,
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
    'lodash',
    ...(DEV
      ? []
      : [
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
          'transform-react-remove-prop-types',
          'transform-react-pure-class-to-function',
        ]),
    // // ['relay', { schema: path.resolve(BUILD_PATH, './schema.json') }],
  ]
  const babelPresets = ['@babel/preset-stage-2', '@babel/preset-react']
  const babelEnvSettings = {
    modules: false,
    useBuiltIns: 'entry',
    debug: false,
  }

  const common = {
    devtool: DEV ? 'source-map' : false,
    stats: {
      colors: true,
      modules: !DEV,
    },
  }

  const commonModuleRules = [
    {
      enforce: 'pre',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    },
  ]

  const commonPlugins = [new webpack.ProgressPlugin()]

  const client = {
    ...common,
    name: 'client',
    entry: [
      './src/sass/global.scss',
      '@babel/polyfill',
      'whatwg-fetch',
      'url-search-params-polyfill',
      './src/client.js',
    ],
    target: 'web',
    devServer: {
      hot: config.hot,
      overlay: true,
      port: DEV_PORT,
      stats: common.stats,
      proxy: {
        '/': `http://localhost:${PORT}`,
      },
    },
    output: {
      filename: DEV
        ? 'scripts/[name].[hash].js'
        : 'scripts/[name].[chunkhash].js',
      path: path.join(BUILD_PATH, 'public'),
      publicPath: '/',
    },
    module: {
      rules: [
        ...commonModuleRules,
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
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: DEV,
                  plugins() {
                    /* eslint-disable global-require */
                    return [
                      require('postcss-cssnext'),
                      require('postcss-flexbugs-fixes'),
                    ]
                    /* eslint-enable global-require */
                  },
                },
              },
              {
                loader: 'sass-loader', // compiles Sass to CSS
                options: sassLoaderOptions,
              },
            ],
          }),
        },
      ],
    },
    plugins: [
      ...commonPlugins,
      extractAppStyles,
      new HtmlWebpackPlugin({
        template: 'raw-loader!src/index.ejs',
        filename: '../index.ejs',
        alwaysWriteToDisk: true,
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'async',
      }),
      new HtmlWebpackHarddiskPlugin(),
    ],
  }

  const server = {
    ...common,
    name: 'server',
    dependencies: ['client'],
    entry: './src/server',
    target: 'async-node',
    output: {
      filename: 'server.js',
      path: BUILD_PATH,
      libraryTarget: 'commonjs2',
    },
    externals: ['./index.js', nodeExternals()],
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    module: {
      rules: [
        ...commonModuleRules,
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
                  targets: {
                    node: 'current',
                  },
                  ...babelEnvSettings,
                },
              ],
              ...babelPresets,
            ],
          },
        },
        {
          test: /\.(css|scss|sass)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'css-loader/locals', // translates CSS into CommonJS
              options: {
                ...cssLoaderOptions,
                importLoaders: 0,
              },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: sassLoaderOptions,
            },
          ],
        },
      ],
    },
    plugins: [
      ...commonPlugins,
      ...(DEV
        ? [
            new webpack.NoEmitOnErrorsPlugin(),
            new WebpackShellPlugin({
              onBuildEnd: ['nodemon --watch build/server.js build/server.js'],
            }),
          ]
        : []),
    ],
  }

  return [client, server]
}
