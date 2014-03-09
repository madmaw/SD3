module SD3 {

    export class ViewSVGGroupGraphSD3 implements IViewSD3 {

        public _rootNodes: ViewSVGGroupGraphNodeSD3[];
        public _bounds: RectangleSD3;
        private _allNodes: ViewSVGGroupGraphNodeSD3[];

        constructor(private _root:Element) {
            this._bounds = new RectangleSD3();
            this._rootNodes = [];
            this._allNodes = [];
        }

        get root(): Element {
            return this._root;
        }

        add(node: Node, render: IObjectRenderSD3): any {
            // walk the tree
            var treeNode = new ViewSVGGroupGraphNodeSD3(render, node);
            this._allNodes.push(treeNode);
            this.addTreeNode(treeNode);
            return treeNode;
        }

        addTreeNode(treeNode: ViewSVGGroupGraphNodeSD3) {
            var adding = treeNode;
            var addingBounds = adding._render.getBounds();
            var addingSeparate = false;
            var added = false;
            for (var i = this._rootNodes.length; i > 0;) {
                i--;
                var rootNode = this._rootNodes[i];
                var replacement = rootNode.insert(adding, addingBounds);
                if (replacement) {
                    if (replacement.node == adding) {
                        if (!replacement.separate) {
                            this._rootNodes.splice(i, 1);
                        }
                        addingSeparate = addingSeparate || replacement.separate;
                    } else {
                        added = true;
                    }
                }
            }
            if (!added) {
                this._rootNodes.push(adding);
            }
            this.redraw();

        }

        remove(nodeId: any, previousBounds: RectangleSD3): void {
            var treeNode = <ViewSVGGroupGraphNodeSD3>nodeId;
            treeNode.removeSelf(this);
            removeFromArray(treeNode, this._allNodes);
            this.redraw();
        }

        reorder(nodeId: any, previousBounds: RectangleSD3, render: IObjectRenderSD3): any {
            var treeNode = <ViewSVGGroupGraphNodeSD3>nodeId;
            treeNode.removeSelf(this);
            treeNode.setRender(render);
            this.addTreeNode(treeNode);
            this.redraw();
            return treeNode;
        }

        replace(nodeId: any, node: Node): any {
            var treeNode = <ViewSVGGroupGraphNodeSD3>nodeId;
            treeNode._renderedNode = node;
            this.redraw();
            return treeNode;
        }

        isInView(rect: RectangleSD3): boolean {
            return this._bounds.overlaps(rect);
        }

        clear(): void {
            // remove all nodes under top level?
            var childNodes = this._root.childNodes;
            for (var i = childNodes.length; i > 0;) {
                i--;
                var childNode = childNodes.item(i);
                this._root.removeChild(childNode);
            }
        }

        /**
         * removes any perception of order, use for mass-reorder 
         */
        invalidate(): void {
            // destroy graph
            for (var i in this._allNodes) {
                var treeNode = this._allNodes[i];
                treeNode.invalidate(false);
            }
            this._rootNodes = [];
        }

        redraw(): void {
            this.clear();
            // TODO don't use this, very inefficient
            this.foreach((node: ViewSVGGroupGraphNodeSD3) => {
                var renderedNode = node._renderedNode;
                if (renderedNode) {
                    this._root.appendChild(renderedNode);
                }
            });
        }

        foreach(f: (node: ViewSVGGroupGraphNodeSD3) => void) {
            var walked = [];
            for (var i in this._rootNodes) {
                var rootNode = this._rootNodes[i];
                rootNode.foreach(f, walked);
            }
        }

        clone() {
            return new ViewSVGGroupGraphSD3(<Element>this._root.cloneNode(false));
        }

        // from IObjectRender

        getBounds(): RectangleSD3 {
            return this._bounds;
        }

        getScreenDepth(x: number, y: number): number {
            // it's invisible
            return null;
        }

        isIn(x: number, y: number): boolean {
            // it's always in
            return true;
        }
        
    }

} 