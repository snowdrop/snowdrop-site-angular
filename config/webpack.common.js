/**
 * @author: tipe.io
 */

const helpers = require('./helpers');

/**
 * Webpack Plugins
 *
 * problem with copy-webpack-plugin
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const GitRevisionPlugin = require('git-revision-webpack-plugin')

const buildUtils = require('./build-utils');

/**
 * Webpack configuration
 *
 * See: https://webpack.js.org/configuration/
 */
module.exports = function(options) {
  const isProd = options.env === 'production';
  const APP_CONFIG = require(process.env.ANGULAR_CONF_FILE || (isProd ? './config.prod.json' : './config.dev.json'));

  const METADATA = Object.assign({}, buildUtils.DEFAULT_METADATA, options.metadata || {});

  const ngcWebpackConfig = buildUtils.ngcWebpackSetup(isProd, METADATA);
  const supportES2015 = buildUtils.supportES2015(METADATA.tsConfigPath);
  const gitRevisionPlugin = new GitRevisionPlugin();

  const entry = {
    polyfills: './src/polyfills.ts',
    main: './src/main.ts'
  };

  Object.assign(ngcWebpackConfig.plugin, {
    tsConfigPath: METADATA.tsConfigPath,
    mainPath: entry.main
  });

  return {
    /**
     * The entry point for the bundle
     * Our Angular.js app
     *
     * See: https://webpack.js.org/configuration/entry-context/#entry
     */
    entry: entry,

    /**
     * Options affecting the resolving of modules.
     *
     * See: https://webpack.js.org/configuration/resolve/
     */
    resolve: {
      mainFields: [...(supportES2015 ? ['es2015'] : []), 'browser', 'module', 'main'],

      /**
       * An array of extensions that should be used to resolve modules.
       *
       * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
       */
      extensions: ['.ts', '.js', '.json'],

      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [helpers.root('src'), helpers.root('node_modules')],

      /**
       * Add support for lettable operators.
       *
       * For existing codebase a refactor is required.
       * All rxjs operator imports (e.g. `import 'rxjs/add/operator/map'` or `import { map } from `rxjs/operator/map'`
       * must change to `import { map } from 'rxjs/operators'` (note that all operators are now under that import.
       * Additionally some operators have changed to to JS keyword constraints (do => tap, catch => catchError)
       *
       * Remember to use the `pipe()` method to chain operators, this functinoally makes lettable operators similar to
       * the old operators usage paradigm.
       *
       * For more details see:
       * https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md#build-and-treeshaking
       *
       * If you are not planning on refactoring your codebase (or not planning on using imports from `rxjs/operators`
       * comment out this line.
       *
       * BE AWARE that not using lettable operators will probably result in significant payload added to your bundle.
       */
      alias: buildUtils.rxjsAlias(supportES2015)
    },

    /**
     * Options affecting the normal modules.
     *
     * See: https://webpack.js.org/configuration/module/
     */
    module: {
      rules: [
        ...ngcWebpackConfig.loaders,

        {
          test: /\.css$/,
          exclude: helpers.root('src', 'app'),
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true}},
          ],
        },

        {
          test: /\.css$/,
          include: helpers.root('src', 'app'),
          use: ['raw-loader', 'postcss-loader'],
        },

        {
          test: /\.scss$/,
          exclude: helpers.root('src', 'app'),
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true}},
            { loader: 'sass-loader', options: { sourceMap: true}}
          ],
        },

        {
          test: /\.scss$/,
          include: helpers.root('src', 'app'),
          use: [
            'to-string-loader',
            'css-loader',
            'sass-loader'
          ]
        },

        /**
         * Raw loader support for *.html
         * Returns file content as string
         *
         * See: https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },

        /**
         * File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },

        /* File loader for supporting fonts, for example, in CSS files.
        */
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: 'file-loader'
        }
      ]
    },

    /**
     * Add additional plugins to the compiler.
     *
     * See: https://webpack.js.org/configuration/plugins/
     */
    plugins: [
      new DefinePlugin({
        'LAUNCHER_JSON_SETTINGS':  JSON.stringify(METADATA.LAUNCHER_JSON_SETTINGS),
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'PUBLIC_PATH' : JSON.stringify(METADATA.PUBLIC_PATH),
          'LAUNCHER_JSON_SETTINGS' : JSON.stringify(METADATA.LAUNCHER_JSON_SETTINGS),
          'LAUNCHER_BACKEND_URL': JSON.stringify(process.env.LAUNCHER_BACKEND_URL || METADATA.LAUNCHER_JSON_SETTINGS.LAUNCHER_BACKEND_URL),
          'LAUNCHER_KEYCLOAK_URL': JSON.stringify(process.env.LAUNCHER_KEYCLOAK_URL || METADATA.LAUNCHER_JSON_SETTINGS.LAUNCHER_KEYCLOAK_URL),
          'LAUNCHER_KEYCLOAK_REALM': JSON.stringify(process.env.LAUNCHER_KEYCLOAK_REALM || METADATA.LAUNCHER_JSON_SETTINGS.LAUNCHER_KEYCLOAK_REALM),
          'LAUNCHER_KEYCLOAK_CLIENT_ID': JSON.stringify(process.env.LAUNCHER_KEYCLOAK_CLIENT_ID || METADATA.LAUNCHER_JSON_SETTINGS.LAUNCHER_KEYCLOAK_CLIENT_ID),
          'LAUNCHER_FRONTEND_SENTRY_DSN': JSON.stringify(process.env.LAUNCHER_FRONTEND_SENTRY_DSN || METADATA.LAUNCHER_JSON_SETTINGS.LAUNCHER_FRONTEND_SENTRY_DSN)
        }
      }),
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.js.org/plugins/define-plugin/
       */
      // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        ENV: JSON.stringify(METADATA.ENV),
        HMR: METADATA.HMR,
        AOT: METADATA.AOT,
        'process.env.ENV': JSON.stringify(METADATA.ENV),
        'process.env.NODE_ENV': JSON.stringify(METADATA.ENV),
        'process.env.HMR': METADATA.HMR
        // 'FIREBASE_CONFIG': JSON.stringify(APP_CONFIG.firebase),
      }),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin(
        [{ from: 'src/assets', to: 'assets' }, { from: 'src/meta' }],
        isProd ? { ignore: ['mock-data/**/*'] } : undefined
      ),

      new MiniCssExtractPlugin({ filename: '[name]-[chunkhash].css' }),

      /*
      * Plugin: HtmlWebpackPlugin
      * Description: Simplifies creation of HTML files to serve your webpack bundles.
      * This is especially useful for webpack bundles that include a hash in the filename
      * which changes every compilation.
      *
      * See: https://github.com/ampedandwired/html-webpack-plugin
      */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: function(a, b) {
          const entryPoints = ['inline', 'polyfills', 'sw-register', 'styles', 'vendor', 'main'];
          return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
        },
        metadata: METADATA,
        inject: 'body',
        xhtml: true,
        minify: isProd
          ? {
              caseSensitive: true,
              collapseWhitespace: true,
              keepClosingSlash: true
            }
          : false
      }),

      /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       *
       * See: https://github.com/numical/script-ext-html-webpack-plugin
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /inline|polyfills|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfills|vendor|main/],
        prefetch: [/chunk/]
      }),

      /**
       * Plugin: HtmlElementsPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

      new AngularCompilerPlugin(ngcWebpackConfig.plugin),

      /**
       * Plugin: WebpackInlineManifestPlugin
       * Inline Webpack's manifest.js in index.html
       *
       * https://github.com/almothafar/webpack-inline-manifest-plugin
       */
      new WebpackInlineManifestPlugin()
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.js.org/configuration/node/
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    },
    optimization: {
      splitChunks: {
       chunks: 'all'
      }
   }
  };
};
