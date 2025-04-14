import { FormAssociatedMixin } from "../mixins/form-associated.ts";
declare const FormAssociatedElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & FormAssociatedMixin.Constructor;
/** A custom element with form association and validation support. */
export declare class FormAssociatedElement extends FormAssociatedElement_base {
}
export declare namespace FormAssociatedElement {
    type Constructor = FormAssociatedMixin.Constructor;
    type Mixin = FormAssociatedMixin.Mixin;
}
export {};
