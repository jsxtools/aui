import { FormAssociatedMixin } from "../mixins/form-associated.ts";
declare const FormAssociatedElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & FormAssociatedMixin.Constructor;
export declare class FormAssociatedElement extends FormAssociatedElement_base {
}
export declare namespace FormAssociatedElement {
    type Constructor = FormAssociatedMixin.Constructor;
    type Mixin = FormAssociatedMixin.Mixin;
}
export {};
