import { mkdir, rm } from "node:fs/promises"
import { $, Glob } from "bun"

await rm("dist", { force: true, recursive: true })
await mkdir("dist", { recursive: true })

await Bun.build({
	entrypoints: await Array.fromAsync(new Glob("src/**/*.ts").scan()),
	format: "esm",
	minify: true,
	outdir: "dist",
	root: "src",
	sourcemap: "none",
	splitting: true,
	target: "browser",
	naming: "[dir]/[name].[ext]",
	external: ["react", "react-dom"],
})

await $`tsc --project tsconfig.json`
