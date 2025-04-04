import type { CustomElementConstructor } from "typed-custom-elements"

export const HTMLElement: CustomElementConstructor = globalThis.HTMLElement || class {}
