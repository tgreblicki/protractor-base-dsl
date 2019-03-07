import paths from '../../utils/paths';

export default {
    entry: {
        index: ['./app']
    },
    externals: [
        'biguint-format',
        'eventsource-polyfill',
        'flake-idgen',
        'jquery',
        'moment',
        'ramda',
        'ramdasauce'
    ],
    mode: 'production',
    module: {
        rules: [
            {
                include: /node_modules/,
                loaders: ['strip-sourcemap-loader'],
                test: /\.js$/
            },
            {
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    plugins: [
                        ['@babel/plugin-proposal-decorators', {legacy: true}],
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-transform-runtime'
                    ]
                },
                test: /\.js?$/
            }
        ]
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    output: {
        chunkFilename: '[name].bundle.js',
        filename: '[name].js',
        library: 'protractor-base-dsl',
        libraryTarget: 'commonjs2',
        path: paths.distDir,
        publicPath: '/dist/'
    }
};
