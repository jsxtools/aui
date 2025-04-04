import { Prism } from "https://assets.codepen.io/21768/prism-core.js"
import "https://assets.codepen.io/21768/prism-html.js"
import "https://assets.codepen.io/21768/prism-javascript.js"

export const Highlight =
	globalThis.Highlight ||
	class Highlight extends Set {
		constructor(range) {
			super([range])
		}
	}

export const highlights = globalThis.CSS?.highlights || new Map()

const highlight = async (node, tokens, type, index) => {
	for (const token of tokens) {
		if (typeof token === "string") {
			const range = new StaticRange({
				startContainer: node,
				startOffset: index,
				endContainer: node,
				endOffset: index + token.length,
			})

			if (highlights.has(type)) {
				highlights.get(type).add(range)
			} else {
				highlights.set(type, new Highlight(range))
			}
		} else {
			highlight(node, [].concat(token.content), token.type, index)
		}

		index += token.length
	}
}

for (const code of document.querySelectorAll("pre > code")) {
	for (const node of code.childNodes) {
		if (node instanceof Text) {
			const tokens = Prism.tokenize(node.data, Prism.languages.html)

			for (let i = tokens.length - 1; i >= 0; --i) {
				if (tokens[i - 1]?.type === "tag" && tokens[i - 1].content?.[0]?.content?.[1] === "script") {
					const scriptToken = Object.create(Object.getPrototypeOf(Prism.tokenize("export", Prism.languages.javascript)[0]))

					scriptToken.alias = undefined
					scriptToken.content = Prism.tokenize(tokens[i], Prism.languages.javascript)
					scriptToken.length = tokens[i].length
					scriptToken.type = "language-javascript"

					tokens.splice(i, 1, scriptToken)
				}
			}

			highlight(node, tokens, "html", 0)
		}
	}
}
