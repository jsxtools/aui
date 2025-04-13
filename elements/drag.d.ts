import { DragMixin } from "../mixins/drag.ts";
declare const DragElement_base: import("../api/dom.ts").CustomElementConstructor<import("../api/dom.ts").CustomElement> & DragMixin.Constructor;
/** A custom element with drag support. */
export declare class DragElement extends DragElement_base {
}
export declare namespace DragElement {
    type Constructor = DragMixin.Constructor;
    type Mixin = DragMixin.Mixin;
}
export {};
