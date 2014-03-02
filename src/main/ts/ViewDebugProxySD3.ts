module SD3 {

    export class ViewDebugProxySD3 implements IViewSD3, IVisualDebugSD3 {

        public debugging;

        constructor(private _proxied: IViewSD3, private _debugContainer:Node, private _debugRectPrototype: SVGRectElement, private _debugLinePrototype:SVGLineElement) {
            this.debugging = true;
        }

        // remove all the debugging artifacts
        public clear() {
            var n = this._debugContainer.firstChild;
            while (n) {
                this._debugContainer.removeChild(n);
                n = this._debugContainer.firstChild;
            }
        }

        // from IViewSD3

        public invalidate() {
            this._proxied.invalidate();
        }

        get root(): Element {
            return this._proxied.root;
        }

        set root(e: Element) {
            this._proxied.root = e;
        }

        add(node: Node, bounds: RectangleSD3, render: IObjectRenderSD3): any {
            //this.renderOrder(order);
            (<Element>node).setAttribute("z", ""+render.getScreenDepth(bounds.cx, bounds.cy));
            return this._proxied.add(node, bounds, render);
        }

        remove(nodeId: any): void {
            this._proxied.remove(nodeId);
        }

        reorder(nodeId: any, bounds: RectangleSD3, render: IObjectRenderSD3): any {
            //this.renderOrder(order);
            (<Element>nodeId).setAttribute("z", "" + render.getScreenDepth(bounds.cx, bounds.cy));
            return this._proxied.reorder(nodeId, bounds, render);
        }

        replace(nodeId: any, node: Node): any {
            return this._proxied.replace(nodeId, node);
        }

        isInView(rect: RectangleSD3): boolean {
            this.debugRect(rect);
            return this._proxied.isInView(rect);
        }

        debugRect(rect: RectangleSD3, stroke?: string): void {
            if (this.debugging) {

                var debugRect = <SVGRectElement>this._debugRectPrototype.cloneNode(false);
                debugRect.width.baseVal.value = rect.width;
                debugRect.height.baseVal.value = rect.height;
                debugRect.x.baseVal.value = rect.minX;
                debugRect.y.baseVal.value = rect.minY;
                if (stroke) {
                    debugRect.setAttribute("stroke", stroke);
                }
                this._debugContainer.appendChild(debugRect);
            }
        }


        clone(): IViewSD3 {
            return new ViewDebugProxySD3(
                this._proxied.clone(),
                this._debugContainer.cloneNode(false),
                this._debugRectPrototype,
                this._debugLinePrototype
            );
        }

    }

} 