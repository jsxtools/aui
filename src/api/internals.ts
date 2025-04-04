/// <reference path="../types/aria-mixin.ts" />

export const setInternalsOf: (host: HTMLElement, init: Partial<ElementInternals>) => ElementInternals = (host, init) => Object.assign(host.attachInternals(), init)
