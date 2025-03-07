export interface ShadowRootInit extends globalThis.ShadowRootInit {
	innerHTML?: string
	adoptedStyleSheets?: CSSStyleSheet[]
}
