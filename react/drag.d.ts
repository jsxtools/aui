import { DragElement } from "../elements/drag.ts";
export declare const DragComponent: (props: DragComponent.Props) => import("react").DOMElement<DragComponent.Props, DragElement>;
export declare namespace DragComponent {
    type Element = DragElement;
    interface Props extends React.ComponentProps<"a-drag"> {
    }
}
declare global {
    interface HTMLElementTagNameMap {
        "a-drag": DragElement;
    }
}
declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "a-drag": React.DetailedHTMLProps<React.HTMLAttributes<DragElement> & {}, DragElement>;
        }
    }
}
