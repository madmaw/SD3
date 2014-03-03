module SD3 {

    export interface IViewSD3 {

        root: Element;

        add(node: Node, render: IObjectRenderSD3): any;

        remove(nodeId: any, previousBounds: RectangleSD3): void;

        reorder(nodeId: any, previousBounds: RectangleSD3, render: IObjectRenderSD3): any;

        replace(nodeId: any, node: Node): any;

        isInView(rect: RectangleSD3): boolean;

        /**
         * removes any perception of order, use for mass-reorder 
         */
        invalidate(): void;

        clone(): IViewSD3;

    }

} 