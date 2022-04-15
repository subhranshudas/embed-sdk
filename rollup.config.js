import { terser } from "rollup-plugin-terser";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginCommonjs from "@rollup/plugin-commonjs";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import filesize from 'rollup-plugin-filesize';
import * as path from "path";
import pkg from "./package.json";

const moduleName = pkg.name.replace(/^@.*\//, "");
const inputFileName = "src/index.ts";

export default [
  {
    input: inputFileName,
    output: [
      {
        name: moduleName,
        file: pkg.browser,
        format: "iife"
      },
      {
        name: moduleName,
        file: pkg.browser.replace(".js", ".min.js"),
        format: "iife",
        plugins: [terser(), uglify(), filesize()],
      },
    ],
    plugins: [
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: true,
      }),
      uglify(),
      filesize()
    ],
  },

  // ES
  {
    input: inputFileName,
    output: [
      {
        file: pkg.module,
        format: "es",
        exports: "named",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
      uglify(),
      filesize()
    ],
  },

  // CommonJS
  {
    input: inputFileName,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "default",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript(),
      pluginCommonjs({
        extensions: [".js", ".ts"],
      }),
      babel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      pluginNodeResolve({
        browser: false,
      }),
      uglify(),
      filesize()
    ],
  },
];