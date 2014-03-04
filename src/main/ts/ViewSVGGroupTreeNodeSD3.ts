 module SD3 {

    export class ViewSVGGroupTreeNodeSD3 {

        public _parent: ViewSVGGroupTreeNodeSD3;
        public _combinedBounds: RectangleSD3;
        public _children: ViewSVGGroupTreeNodeSD3[];
        public _render: IObjectRenderSD3;
        public _renderedNode: Node;

        constructor(render: IObjectRenderSD3, public _groupElement: Element, renderedNode?:Node) {
            this._combinedBounds = new RectangleSD3();
            this._children = [];
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

        public getDepth(sx: number, sy: number): number {
            var result;
            if (this._combinedBounds.contains(sx, sy)) {
                var bounds = this._render.getBounds();
                if (bounds.contains(sx, sy)) {
                    result = this._render.getScreenDepth(sx, sy);
                } else {
                    result = null;
                }
                if (result == null) {
                    // check the children
                    for (var i in this._children) {
                        var child = this._children[i];
                        result = child.getDepth(sx, sy);
                        if (result != null) {
                            break;
                        }
                    }
                }
            } else {
                result = null;
            }
            return result;
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

        public checkRemovalOwnership(child: ViewSVGGroupTreeNodeSD3) {
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
                if (this._parent) {
                    // check that we still sit in the parent bounds
                    this._parent.checkRemovalOwnership(this);
                }
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

        public checkAdditionOwnership(changedChild: ViewSVGGroupTreeNodeSD3) {
            var changedBounds = changedChild._combinedBounds;
            this._combinedBounds.union(changedBounds);
            // TODO only do this if the bounds have actually changed
            for (var i in this._children) {
                var child = this._children[i];
                if (child != changedChild) {
                    var childBounds = child._combinedBounds;
                    if (childBounds.overlaps(changedBounds)) {
                        // there may be others that it overlaps with, but they will be handled by this change
                        this.disown(child);
                        this.insert(child, childBounds);
                        break;
                    }
                }
            }
        }

        public forceAdopt(child: ViewSVGGroupTreeNodeSD3) {
            child._parent = this;
            this._children.push(child);
            this.appendChildNode(child._groupElement);
            // we may need to reposition this node if it has grown to overlap with siblings
            this.checkAdditionOwnership(child);
        }

        public appendChildNode(node: Node) {
            if (this._renderedNode) {
                this._groupElement.insertBefore(node, this._renderedNode);
            } else {
                this._groupElement.appendChild(node);
            }
        }

        public insert(treeNode: ViewSVGGroupTreeNodeSD3, bounds: RectangleSD3) {
            var added = false;
            for (var i in this._children) {
                var child = this._children[i];
                if (child._combinedBounds.overlaps(bounds)) {
                    // is it infront-of or behind the child?
                    var inject;
                    var childBounds = child._render.getBounds();
                    if (childBounds.overlaps(bounds)) {
                        var intersection = new RectangleSD3();
                        RectangleSD3.intersect(childBounds, bounds, intersection);
                        var cx = intersection.cx;
                        var cy = intersection.cy;
                        var childDepth = child.getDepth(cx, cy);
                        var depth = treeNode.getDepth(cx, cy);
                        inject = childDepth > depth;
                    } else {
                        inject = false;
                    }
                    if (inject) {
                        // replace the child
                        this.disown(child);
                        treeNode.forceAdopt(child);
                        this.forceAdopt(treeNode);
                    } else {
                        // insert it into the child
                        child.insert(treeNode, bounds);
                    }
                    added = true;
                    break;
                }
            }
            if (!added) {
                // add as a child of this
                this.forceAdopt(treeNode);
            }
        }

        public removeSelf(): boolean {
            // remove self from parent node
            var result;
            if (this._parent) {
                this._parent.disown(this);
                for (var i in this._children) {
                    var child = this._children[i];
                    this._groupElement.removeChild(child._groupElement);
                    this._parent.adopt(child);
                }
                this._children = [];
                result = true;
            } else {
                result = false;
            }
            return result;
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
                this.setRenderedNode(node);
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

        public foreach(iterator:(treeNode:ViewSVGGroupTreeNodeSD3)=>void) {
            iterator(this);
            for (var i in this._children) {
                var child = this._children[i];
                child.foreach(iterator);
            }
        }

    }
 }