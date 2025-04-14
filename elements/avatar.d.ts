import { AvatarMixin } from "../mixins/avatar.ts";
declare const AvatarElement_base: import("../types.ts").CustomElementConstructor<import("../types.ts").CustomElement> & AvatarMixin.Constructor;
/** A custom element with an easily styleable avatar image. */
export declare class AvatarElement extends AvatarElement_base {
}
export declare namespace AvatarElement {
    type Constructor = AvatarMixin.Constructor;
    type Mixin = AvatarMixin.Mixin;
}
export {};
