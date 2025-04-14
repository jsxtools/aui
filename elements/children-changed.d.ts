import { ChildrenChangedMixin } from "../mixins/children-changed.ts";
declare const ChildrenChangedElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & ChildrenChangedMixin.Constructor;
/** A custom element that provides children observation support. */
export declare class ChildrenChangedElement extends ChildrenChangedElement_base {
}
export declare namespace ChildrenChangedElement {
    type Constructor = ChildrenChangedMixin.Constructor;
    type Mixin = ChildrenChangedMixin.Mixin;
}
export {};
