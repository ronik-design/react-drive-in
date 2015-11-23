import babel from "rollup-plugin-babel";
import inject from "rollup-plugin-inject";
import npm from "rollup-plugin-npm";
import commonjs from "rollup-plugin-commonjs";


export default {
  entry: "lib/react-drive-in.jsx",
  external: ["react"],
  plugins: [
    inject({ "React": "react" }),
    npm({ jsnext: true, main: true, skip: ["react"] }),
    commonjs(),
    babel()
  ],
  dest: "dist/react-drive-in-browser.js",
  moduleName: "ReactDriveIn",
  format: "iife"
};
