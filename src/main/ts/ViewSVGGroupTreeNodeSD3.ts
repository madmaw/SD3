 module SD3 {

    export class ViewSVGGroupTreeNodeSD3 {

        public _parent: ViewSVGGroupTreeNodeSD3;
        public _combinedBounds: RectangleSD3;
        public _children: ViewSVGGroupTreeNodeSD3[];
        public _render: IObjectRenderSD3;
        public _renderedNode: Node;

        constructor(render: IObjectRenderSD3, public _groupElement: Element, renderedNode?:Node) {
            this._combinedBounds = new RectangleSD3();
            this.setRender(render);
            this.setRenderedNode(renderedNode);
        }

        public setRenderedNode(renderedNode: Node) {
            // TODO manage this as children are added and removed
            if (this._renderedNode) {
                this._groupElement.removeChild(this._renderedNode);
            }
            this._renderedNode = renderedNode;
            if (renderedNode) {
                this._groupElement.appendChild(renderedNode);
            }
        }

        public setRender(render: IObjectRenderSD3) {
            this._render = render;
            this._combinedBounds.copy(render.getBounds());
        }

        public recalculateCombinedBounds(into:RectangleSD3=this._combinedBounds, excludeChild?:ViewSVGGroupTreeNodeSD3) {
            into.copy(this._render.getBounds());
            for (var i in this._children) {
                var child = this._children[i];
                if (child != excludeChild) {
                    into.union(child._combinedBounds);
                }
            }
        }

        public checkOwnership(child: ViewSVGGroupTreeNodeSD3) {
            var newBounds = new RectangleSD3();
            this.recalculateCombinedBounds(newBounds, child);
            if (this._parent != null && !child._combinedBounds.overlaps(newBounds)) {
                // the child is outside the bounds, disown
                this._combinedBounds.copy(newBounds);
                this._parent.adopt(child);
                this.disown(child);
            }
        }

        public disown(child: ViewSVGGroupTreeNodeSD3) {
            // remove the child
            if (removeFromArray(child, this._children)) {
                this._groupElement.removeChild(child._groupElement);
                // adjust the combined bounds
                this.recalculateCombinedBounds();
                // check that we still sit in the parent bounds
                this._parent.checkOwnership(this);
            }

        }

        public adopt(child:ViewSVGGroupTreeNodeSD3) {
            // check that it fits in the combined bounds
            if (this._parent == null || this._combinedBounds.overlaps(child._combinedBounds)) {
                // add it
                this.forceAdopt(child);
            } else {
                // pass it back
                this._parent.adopt(child);
            }
        }

        public forceAdopt(child: ViewSVGGroupTreeNodeSD3) {
            this._children.push(child);
            this._combinedBounds.union(child._combinedBounds);
            this._groupElement.appendChild(child._groupElement);
        }

        public insert(treeNode: ViewSVGGroupTreeNodeSD3, bounds: RectangleSD3) {
            var added = false;
            for (var i in this._children) {
                var child = this._children[i];
                if (child._combinedBounds.overlaps(bounds)) {
                    // insert it into the child
                    child.insert(treeNode, bounds);
                    added = true;
                    break;
                }
            }
            if (!added) {
                // add as a child of this
                this.forceAdopt(treeNode);
            }
        }

        public removeSelf() {
            // remove self from parent node
            this._parent.disown(this);
            for (var i in this._children) {
                var child = this._children[i];
                this._parent.adopt(child);
            }
            this._children = [];
        }

        public remove(render:IObjectRenderSD3, bounds:RectangleSD3): Node {
            var result;
            if (render == this._render) {
                // replace
                if (this._renderedNode != null) {
                    this.removeSelf();
                    result = this._renderedNode;
                }
            } else {
                // should only ever be one overlapping branch
                result = null;
                for (var i in this._children) {
                    var child = this._children[i];
                    if (child._combinedBounds.overlaps(bounds)) {
                        result = child.remove(render, bounds);
                        if (result) {
                            break;
                        }
                    }
                }
            }
            return result;
            
        }

        public replace(render: IObjectRenderSD3, bounds: RectangleSD3, node: Node): boolean {
            var result;
            if (render == this._render) {
                // replace
                if (this._renderedNode != null) {
                    this._groupElement.removeChild(this._renderedNode);
                    this._groupElement.appendChild(node);
                    this._renderedNode = node;
                }
                result = true;
            } else {
                // should only ever be one overlapping branch
                result = false;
                for (var i in this._children) {
                    var child = this._children[i];
                    if (child._combinedBounds.overlaps(bounds)) {
                        result = child.replace(render, bounds, node);
                        if (result) {
                            break;
                        }
                    }
                }
            }
            return result;
        }

        public removeAllChildren() {
            for (var i in this._children) {
                var branch = this._children[i];
                this._groupElement.removeChild(branch._groupElement);
            }
            this._children = [];
        }

    }
 }