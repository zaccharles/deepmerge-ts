/**
 * Rollup Config.
 */

import rollupPluginJSON from "@rollup/plugin-json";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";
import rollupPluginAutoExternal from "rollup-plugin-auto-external";
import rollupPluginDts from "rollup-plugin-dts";
import rollupPluginReplaceImports from "rollup-plugin-replace-imports";

import pkg from "./package.json";

const common = {
  input: "src/index.ts",

  output: {
    sourcemap: false,
  },

  external: [],

  treeshake: {
    annotations: true,
    moduleSideEffects: [],
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
};

/**
 * Get new instances of all the common plugins.
 */
function getPlugins() {
  return [
    rollupPluginAutoExternal(),
    rollupPluginNodeResolve(),
    rollupPluginTypescript({
      tsconfig: "tsconfig.build.json",
    }),
    rollupPluginJSON({
      preferConst: true,
    }),
  ];
}

const cjs = {
  ...common,

  output: {
    ...common.output,
    file: pkg.main,
    format: "cjs",
  },

  plugins: getPlugins(),
};

const esm = {
  ...common,

  output: {
    ...common.output,
    file: pkg.module,
    format: "esm",
  },

  plugins: getPlugins(),
};

const dts = {
  ...common,

  output: {
    file: pkg.types,
    format: "es",
  },

  plugins: [rollupPluginDts()],
};

const deno = {
  ...esm,

  output: {
    ...esm.output,
    file: "lib/deno.js",
  },

  plugins: [
    rollupPluginReplaceImports((path) =>
      path === "is-plain-object"
        ? "https://raw.githubusercontent.com/jonschlinkert/is-plain-object/v5.0.0/is-plain-object.js"
        : path
    ),
    ...esm.plugins,
  ],
};

export default [cjs, esm, dts, deno];
