import { AccordionMixin } from "../mixins/accordion.ts";
declare const AccordionElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & AccordionMixin.Constructor;
/** A custom element with collapsible sections by heading. */
export declare class AccordionElement extends AccordionElement_base {
}
export declare namespace AccordionElement {
    type Constructor = AccordionMixin.Constructor;
    type Mixin = AccordionMixin.Mixin;
}
export {};
