module.exports = {
    entry: './src/main.js',
    output: {
        path: './dist',
        filename: './main.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel', // 'babel-loader' is also analyzer legal name to reference
                query: {
                    presets: ['es2017']
                }
            }
        ]
    },
    devServer: {
        hot: true,
        quiet: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};
