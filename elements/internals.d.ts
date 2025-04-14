import { InternalsMixin } from "../mixins/internals.ts";
declare const InternalsElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & InternalsMixin.Constructor;
/** A custom element that provides the ElementInternals API. */
export declare class InternalsElement extends InternalsElement_base {
}
export declare namespace InternalsElement {
    type Constructor = InternalsMixin.Constructor;
    type Mixin = InternalsMixin.Mixin;
}
export {};
