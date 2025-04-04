export const CSSStyleSheet =
	globalThis.CSSStyleSheet ||
	class {
		replaceSync(): void {}
	}
