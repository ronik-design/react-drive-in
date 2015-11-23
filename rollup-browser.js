/* eslint no-console:0 */

const rollup = require("rollup").rollup;
const babel = require("rollup-plugin-babel");
const inject = require("rollup-plugin-inject");
const npm = require("rollup-plugin-npm");
const commonjs = require("rollup-plugin-commonjs");


const input = {
  entry: "lib/react-drive-in.jsx",
  external: ["react"],
  plugins: [
    inject({ "React": "react" }),
    npm({ jsnext: true, main: true, skip: ["react"] }),
    commonjs(),
    babel()
  ]
};

const output = {
  dest: "dist/react-drive-in-browser.js",
  moduleName: "ReactDriveIn",
  format: "iife"
};

rollup(input).then((bundle) => bundle.write(output)).catch(console.error);
