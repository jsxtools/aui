import { ShadowMixin } from "../mixins/shadow.ts";
declare const ShadowElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & ShadowMixin.Constructor;
/** A Custom Element that provides a configurable ShadowRoot. */
export declare class ShadowElement extends ShadowElement_base {
}
export declare namespace ShadowElement {
    type Constructor = ShadowMixin.Constructor;
    type Mixin = ShadowMixin.Mixin;
}
export {};
