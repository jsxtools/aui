const transpiler = new Bun.Transpiler({ loader: "ts" })

const server = Bun.serve({
	hostname: "0.0.0.0",
	port: 3000,
	async fetch(request) {
		const url = new URL(request.url)

		if (url.pathname === "/") {
			const file = Bun.file("demo/index.html")

			if (await file.exists()) {
				return new Response(file.stream(), {
					headers: {
						"content-type": "text/html;charset=UTF-8",
						"content-length": file.size.toString(),
						"last-modified": new Date(file.lastModified).toUTCString(),
					},
				})
			}
		}

		if (/\.(js|ts)$/.test(url.pathname)) {
			const path = `src${url.pathname.slice(0, -2)}ts`
			const file = Bun.file(path)

			if (await file.exists()) {
				const code = await transpiler.transform(await file.text())

				return new Response(code, {
					headers: {
						"content-type": "application/javascript;charset=UTF-8",
						"content-length": code.length.toString(),
						"last-modified": new Date(file.lastModified).toUTCString(),
					},
				})
			}
		}

		if (/\/[\w-]+$/.test(url.pathname)) {
			const file = Bun.file("demo" + url.pathname + ".html")

			if (await file.exists()) {
				return new Response(file.stream(), {
					headers: {
						"content-type": "text/html;charset=UTF-8",
						"content-length": file.size.toString(),
						"last-modified": new Date(file.lastModified).toUTCString(),
					},
				})
			}
		} else {
			const file = Bun.file("demo" + url.pathname)

			if (await file.exists()) {
				return new Response(file.stream(), {
					headers: {
						"content-type": file.type,
						"content-length": file.size.toString(),
						"last-modified": new Date(file.lastModified).toUTCString(),
					},
				})
			}
		}

		return new Response("Not Found", { status: 404 })
	},
})

console.log(`Live at ${server.url}`)
