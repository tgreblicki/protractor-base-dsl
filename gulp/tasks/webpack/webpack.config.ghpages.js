import R from 'ramda';
import paths from '../../utils/paths';
import {dependencies} from '../../../package.json';

export default {
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
            {test: require.resolve('jquery'), use: ['expose-loader?jQuery', 'expose-loader?$']},
            {
                exclude: /(node_modules|tmp)/,
                loader: 'babel-loader',
                test: /\.js$/
            }
        ]
    },
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
        filename: '[name].js',
        path: paths.ghPagesDir,
        publicPath: ''
    }
};
