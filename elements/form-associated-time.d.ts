import { FormAssociatedTimeMixin } from "../mixins/form-associated-time.ts";
declare const FormAssociatedTimeElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & FormAssociatedTimeMixin.Constructor;
/** A custom element with an interface to manipulate time values with form association. */
export declare class FormAssociatedTimeElement extends FormAssociatedTimeElement_base {
}
export declare namespace FormAssociatedTimeElement {
    type Constructor = FormAssociatedTimeMixin.Constructor;
    type Mixin = FormAssociatedTimeMixin.Mixin;
}
export {};
