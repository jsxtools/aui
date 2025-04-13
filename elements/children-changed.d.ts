import { ChildrenChangedMixin } from "../mixins/children-changed.ts";
declare const ChildrenChangedElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & ChildrenChangedMixin.Constructor;
/** A Custom Element with keyboard-accessible click support. */
export declare class ChildrenChangedElement extends ChildrenChangedElement_base {
}
export declare namespace ChildrenChangedElement {
    type Constructor = ChildrenChangedMixin.Constructor;
    type Mixin = ChildrenChangedMixin.Mixin;
}
export {};
