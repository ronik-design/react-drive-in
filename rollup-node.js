/* eslint no-console:0 */

const rollup = require("rollup").rollup;
const babel = require("rollup-plugin-babel");


const input = {
  entry: "lib/react-drive-in.jsx",
  external: ["react", "drive-in"],
  plugins: [babel()]
};

const output = {
  dest: "dist/react-drive-in.js",
  format: "cjs"
};

rollup(input).then((bundle) => bundle.write(output)).catch(console.error);
