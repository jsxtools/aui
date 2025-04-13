import { DropMixin } from "../mixins/drop.ts";
declare const DropElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & DropMixin.Constructor;
/** A custom element with drop support. */
export declare class DropElement extends DropElement_base {
}
export declare namespace DropElement {
    type Constructor = DropMixin.Constructor;
    type Mixin = DropMixin.Mixin;
}
export {};
