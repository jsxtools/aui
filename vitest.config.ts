import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [react()],
	test: {
		include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
		browser: {
			enabled: true,
			headless: true,
			provider: "playwright",
			instances: [
				{
					browser: "chromium",
				},
				{
					browser: "webkit",
				},
			],
		},
		coverage: {
			provider: "v8",
			reporter: ["json", "text"],
			reportsDirectory: "./coverage",
			include: ["src/{api/elements,mixins,react}/*.ts"],
			exclude: [
				"src/**/_*.ts",
				"src/**/_*.tsx",
				"src/{elements,mixins,react}/{accordion,alert-dialog,avatar,calendar,context,form-associated-checkbox,form-associated-choice,form-associated-radio,form-associated-time,notification,option,toast-list,toggle,toggle-group}-{component,element,mixin}.ts",
			],
		},
	},
})
