import babel from "rollup-plugin-babel";


export default {
  entry: "lib/react-drive-in.jsx",
  external: ["react", "drive-in"],
  plugins: [babel()],
  dest: "dist/react-drive-in.js",
  format: "cjs"
};
