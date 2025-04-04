export const setShadowOf = (host: HTMLElement, { adoptedStyleSheets = [], innerHTML = "<slot>", ...init }: setShadowOf.Init) =>
	Object.assign(host.attachShadow(init), { adoptedStyleSheets, innerHTML })

export namespace setShadowOf {
	export interface Init extends ShadowRootInit {
		adoptedStyleSheets?: CSSStyleSheet[]
		innerHTML?: string
	}
}
