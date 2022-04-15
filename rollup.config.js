import typescriptPlugin from "@rollup/plugin-typescript";

export default [
    {
        input: "src/index.ts",
        output: {
            file: "dist/embedsdk.esm.js",
            format: "esm"
        },
        plugins: [
            typescriptPlugin({
                tsconfig: "./tsconfig.json"
            })
        ]
    }
];