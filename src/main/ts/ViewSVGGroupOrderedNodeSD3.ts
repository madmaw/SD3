module SD3 {

    export class ViewSVGGroupOrderedNodeSD3 {

        public static compare (o1: ViewSVGGroupOrderedNodeSD3, o2: ViewSVGGroupOrderedNodeSD3): number {
            var z1 = o1.render.getScreenDepth(o1.bounds.cx, o1.bounds.cy);
            var z2 = o2.render.getScreenDepth(o2.bounds.cx, o2.bounds.cy);
            return Math.round(z2 - z1);
        }

        constructor(public node: Node, public bounds: RectangleSD3, public render: IObjectRenderSD3) {
        }

    }

} 