import R from 'ramda';
import paths from '../../utils/paths';
import {dependencies} from '../../../package.json';

export default {
    devtool: 'inline-source-map',
    entry: {
        polyfills: './app/polyfills.js',
        main: [
            'eventsource-polyfill',
            './app/index'
        ],
        vendor: R.keys(dependencies)
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use: ['expose-loader?jQuery', 'expose-loader?$']
            },
            {
                exclude: /(node_modules|tmp)/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                },
                test: /\.js$/
            }
        ]
    },
    node: {module: 'empty'},
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'all',
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/
                },
                default: false
            }
        }
    },
    output: {
        filename: '[name]-[hash].js',
        path: paths.devDistDir,
        publicPath: '/'
    }
};
