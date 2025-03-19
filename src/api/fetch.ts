/** Performs an HTTP request using XMLHttpRequest, mimicking the Fetch API's behavior. */
export const fetch = (
	/** Resource to fetch, which can be a Request object, URL, or string. */
	resource: string | URL | Request,
	/** Optional configuration including headers, method, body, and signal for handling progress and abortion. */
	options = null as unknown as RequestInit,
): Promise<Response> =>
	new Promise((resolve, reject) => {
		const request = new Request(resource, options)

		const xhr = new XMLHttpRequest()

		const abort = () => xhr.abort()

		xhr.open(request.method, request.url)

		for (const [key, value] of Object.entries(request.headers)) {
			xhr.setRequestHeader(key, value)
		}

		xhr.withCredentials = request.credentials === "include"

		xhr.responseType = "blob"

		xhr.onload = () => {
			options?.signal?.removeEventListener("abort", abort)

			resolve(
				new Response(xhr.response, {
					status: xhr.status,
					statusText: xhr.statusText,
					headers: toHeaders(xhr.getAllResponseHeaders()),
				}),
			)
		}

		xhr.onerror = xhr.ontimeout = () => reject(new Error("Request failed"))

		xhr.onabort = () => reject(new Error("Request aborted"))

		xhr.onprogress = (event) => options?.signal?.dispatchEvent(new ProgressEvent("progress", event))

		options?.signal?.addEventListener("abort", abort)

		if (request.body) {
			request[request.headers.get("Content-Type")?.startsWith("multipart/form-data") ? "formData" : "blob"]().then((init) => xhr.send(init))
		} else {
			xhr.send()
		}
	})

const toHeaders = (responseHeaders: string) => {
	const headers = new Headers()

	for (const line of responseHeaders.trim().split(/[\r\n]+/)) {
		const [header, ...value] = line.split(": ")

		headers.append(header!, value.join(": "))
	}

	return headers
}
