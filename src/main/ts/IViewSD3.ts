module DD.SD3 {

    export interface IViewSD3 {

        root: Element;

        add(node: Node, bounds:RectangleSD3, render: IObjectRenderSD3): any;

        remove(nodeId: any): void;

        reorder(nodeId: any, bounds: RectangleSD3, render: IObjectRenderSD3): any;

        replace(nodeId: any, node: Node): any;

        isInView(rect: RectangleSD3): boolean;

        /**
         * removes any perception of order, use for mass-reorder 
         */
        invalidate(): void;

        clone(): IViewSD3;

    }

} 