import type { CustomElementConstructor } from "../types.ts"

export const HTMLElement: CustomElementConstructor = globalThis.HTMLElement || class {}
