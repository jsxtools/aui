export const css = (...cssText: string[]): CSSStyleSheet => {
	const sheet = new CSSStyleSheet()

	sheet.replaceSync(cssText.join(""))

	return sheet
}
