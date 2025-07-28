import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
    build: {
        minify: mode === 'ci' ? false : 'esbuild',
        sourcemap: mode !== 'ci',
        cssCodeSplit: mode !== 'ci',
        reportCompressedSize: mode !== 'ci',
        rollupOptions: {
            onwarn: (warning, warn) => {
                // Suppress "Module level directives cause errors when bundled" warnings
                if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
                    return
                }
                warn(warning)
            },
        },
    },
    plugins: [ svgr() ],
    server: {
        allowedHosts: true,
    },
}))
