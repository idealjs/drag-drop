const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                noEmit: false,
                            },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.svg/,
                use: "url-loader",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "react/jsx-runtime": "react/jsx-runtime.js",
        },
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "umd",
        filename: "index.js",
    },
    externals: ["react", "react-dom"],
};
