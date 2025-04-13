import { FormAssociatedTimeMixin } from "../mixins/form-associated-time.ts";
declare const FormAssociatedTimeElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & FormAssociatedTimeMixin.Constructor;
export declare class FormAssociatedTimeElement extends FormAssociatedTimeElement_base {
}
export declare namespace FormAssociatedTimeElement {
    type Constructor = FormAssociatedTimeMixin.Constructor;
    type Mixin = FormAssociatedTimeMixin.Mixin;
}
export {};
