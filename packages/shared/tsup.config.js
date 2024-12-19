"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ["src/index.ts", "src/common/index.ts", "src/server/index.ts"],
    format: ["esm", "cjs"],
    dts: {
        compilerOptions: {
            moduleResolution: "Node",
            composite: false,
            incremental: false,
        },
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
});
