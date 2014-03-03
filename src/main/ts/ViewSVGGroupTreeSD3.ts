module SD3 {

    export class ViewSVGGroupTreeSD3 implements IViewSD3, IObjectRenderSD3 {

        private _rootNode: ViewSVGGroupTreeNodeSD3;
        private _bounds: RectangleSD3;

        constructor(private _groupPrototype:Element) {
            this._bounds = new RectangleSD3();
            this._rootNode = new ViewSVGGroupTreeNodeSD3(this, <Element>_groupPrototype.cloneNode(false));
        }

        get root(): Element {
            return this._rootNode._groupElement;
        }

        add(node: Node, render: IObjectRenderSD3): any {
            // walk the tree
            var treeNode = new ViewSVGGroupTreeNodeSD3(render, <Element>this._groupPrototype.cloneNode(false), node);
            this._rootNode.insert(treeNode, render.getBounds());
            return treeNode;
        }

        remove(nodeId: any, previousBounds: RectangleSD3): void {
            var treeNode = <ViewSVGGroupTreeNodeSD3>nodeId;
            treeNode.removeSelf();
        }

        reorder(nodeId: any, previousBounds: RectangleSD3, render: IObjectRenderSD3): any {
            var treeNode = <ViewSVGGroupTreeNodeSD3>nodeId;
            treeNode.removeSelf();
            treeNode.setRender(render);
            this._rootNode.insert(treeNode, render.getBounds());
            return treeNode;
        }

        replace(nodeId: any, node: Node): any {
            var treeNode = <ViewSVGGroupTreeNodeSD3>nodeId;
            treeNode.setRenderedNode(node);
            return treeNode;
        }

        isInView(rect: RectangleSD3): boolean {
            return this._bounds.overlaps(rect);
        }

        /**
         * removes any perception of order, use for mass-reorder 
         */
        invalidate(): void {
            // remove all nodes under top level?
            this._rootNode.removeAllChildren();
        }

        clone() {
            return new ViewSVGGroupTreeSD3(this._groupPrototype);
        }

        // from IObjectRender

        getBounds(): RectangleSD3 {
            return this._bounds;
        }

        getScreenDepth(x: number, y: number): number {
            // it's always behind
            return Number.MAX_VALUE;
        }

        isIn(x: number, y: number): boolean {
            // it's always in
            return true;
        }
        
    }

} 