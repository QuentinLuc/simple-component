import less from "rollup-plugin-less";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
  plugins: [
    less({ insert: true, output: "dist" }),
    typescript({
      tsconfigOverride: { compilerOptions: { module: "es2015" } },
      typescript: require("typescript")
    })
  ]
};
