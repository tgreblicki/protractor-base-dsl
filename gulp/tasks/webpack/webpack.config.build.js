import paths from '../../utils/paths';

export default {
    devtool: 'inline-source-map',
    entry: {
        index: ['./app']
    },
    externals: {
        'selenium-webdriver/lib/webdriver': 'selenium-webdriver/lib/webdriver',
        'xl-html-dnd': 'xl-html-dnd'
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
        minimize: false
    },
    output: {
        filename: '[name].js',
        library: 'protractor-base-dsl',
        libraryTarget: 'commonjs2',
        path: paths.distDir
    },
    target: 'node'
};
