import { FormAssociatedFileMixin } from "../mixins/form-associated-file.ts";
declare const FormAssociatedFileElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & FormAssociatedFileMixin.Constructor;
/** A custom file element with form association and validation. */
export declare class FormAssociatedFileElement extends FormAssociatedFileElement_base {
}
export declare namespace FormAssociatedFileElement {
    type Constructor = FormAssociatedFileMixin.Constructor;
    type Mixin = FormAssociatedFileMixin.Mixin;
}
export {};
