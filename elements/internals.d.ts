import { InternalsMixin } from "../mixins/internals.ts";
declare const InternalsElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & InternalsMixin.Constructor;
export declare class InternalsElement extends InternalsElement_base {
}
export declare namespace InternalsElement {
    type Constructor = InternalsMixin.Constructor;
    type Mixin = InternalsMixin.Mixin;
}
export {};
