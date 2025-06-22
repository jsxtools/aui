export const $create = <K extends keyof HTMLElementTagNameMap>(name: K, ...parts: (Node | string | ElementPropsOf<HTMLElementTagNameMap[K]>)[]): HTMLElementTagNameMap[K] =>
	$assign(document.createElement(name), ...parts)

export const $assign = <T extends HTMLElement>(element: T, ...parts: (Node | string | ElementPropsOf<T>)[]): T => (
	element.append(
		// @ts-ignore: filter returning nothing is an implicit false
		...parts.filter((part) => {
			if (part !== Object(part) || part instanceof Node) {
				if (part) {
					return true
				}
			}

			Object.assign(element, part)
		}),
	),
	element
)

export type ElementPropsOf<T> = {
	[K in `on${keyof HTMLElementEventMap}`]?: K extends `on${infer EventName extends keyof HTMLElementEventMap}` ? (this: T, event: HTMLElementEventMap[EventName]) => void : never
} & {
	[K in keyof T]?: unknown
}
