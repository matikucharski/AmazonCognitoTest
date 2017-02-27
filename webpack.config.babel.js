module.exports = {
    resolve: {
        extensions: ['.js', 'jsx'],
    },
    devtool: "cheap-eval-source-map",
    entry: ['./src/main.jsx'],
    // Place output files in `./dist/my-app.js`
    output: {
        path: 'dist',
        filename: 'cognitoApp.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};