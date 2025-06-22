import type { CustomElementRegistry } from "../types.ts"

export const customElements: CustomElementRegistry = globalThis.customElements || { define() {} }
