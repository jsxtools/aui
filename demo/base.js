document.currentScript.before(
	Object.assign(document.createElement("script"), {
		type: "importmap",
		textContent: JSON.stringify({
			imports: {
				"@jsxtools/aui/elements/accordion": "./accordion-element.js",
				"@jsxtools/aui/elements/toggle": "./toggle-element.js",
				"@jsxtools/aui/elements/toggle-group": "./toggle-group-element.js",
				"context-protocol": "https://jsxtools.com/context-protocol/context.js",
				"context-protocol/subscriptions": "https://jsxtools.com/context-protocol/subscriptions.js",
			},
		}),
	}),
)

"oncommand" in HTMLElement.prototype || document.write("<script src=https://jsxtools.com/aui/polyfills/invoker-commands.js><" + "/script>")
