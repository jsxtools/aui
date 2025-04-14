import { FormAssociatedCheckboxMixin } from "../mixins/checkbox.ts";
declare const FormAssociatedCheckboxElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & FormAssociatedCheckboxMixin.Constructor;
/** A custom element that provides children observation support. */
export declare class FormAssociatedCheckboxElement extends FormAssociatedCheckboxElement_base {
}
export declare namespace FormAssociatedCheckboxElement {
    type Constructor = FormAssociatedCheckboxMixin.Constructor;
    type Mixin = FormAssociatedCheckboxMixin.Mixin;
}
export {};
