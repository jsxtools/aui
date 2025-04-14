import { ClickMixin } from "../mixins/click.ts";
declare const ClickElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & ClickMixin.Constructor;
/** A custom element with keyboard-accessible click support. */
export declare class ClickElement extends ClickElement_base {
}
export declare namespace ClickElement {
    type Constructor = ClickMixin.Constructor;
    type Mixin = ClickMixin.Mixin;
}
export {};
