import { ShadowMixin } from "../mixins/shadow.ts";
declare const ShadowElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & ShadowMixin.Constructor;
/** A custom element that provides a configurable ShadowRoot. */
export declare class ShadowElement extends ShadowElement_base {
}
export declare namespace ShadowElement {
    type Constructor = ShadowMixin.Constructor;
    type Mixin = ShadowMixin.Mixin;
}
export {};
