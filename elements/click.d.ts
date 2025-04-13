import { ClickMixin } from "../mixins/click.ts";
declare const ClickElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & ClickMixin.Constructor;
/** A Custom Element with keyboard-accessible click support. */
export declare class ClickElement extends ClickElement_base {
}
export declare namespace ClickElement {
    type Constructor = ClickMixin.Constructor;
    type Mixin = ClickMixin.Mixin;
}
export {};
