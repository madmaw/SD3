 module SD3 {

    export class ViewSVGGroupGraphNodeSD3 {

        public _combinedBounds: RectangleSD3;
        public _parents: ViewSVGGroupGraphNodeSD3[];
        public _children: ViewSVGGroupGraphNodeSD3[];
        public _render: IObjectRenderSD3;
        

        constructor(render: IObjectRenderSD3, public _renderedNode?: Node) {
            this._combinedBounds = new RectangleSD3();
            this._children = [];
            this._parents = [];
            this.setRender(render);
        }

        public getScreenDepth(sx: number, sy: number): number {
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
                        result = child.getScreenDepth(sx, sy);
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

        public recalculateCombinedBounds() {
            var compare = new RectangleSD3();
            compare.copy(this._combinedBounds);
            this._combinedBounds.copy(this._render.getBounds());
            for (var i in this._children) {
                var child = this._children[i];
                this._combinedBounds.union(child._combinedBounds);
            }
            if (!compare.equals(this._combinedBounds)) {
                for (var i in this._parents) {
                    var parent = this._parents[i];
                    parent.recalculateCombinedBounds();
                }
            }
        }

        public disown(child: ViewSVGGroupGraphNodeSD3) {
            // remove the child
            if (removeFromArray(child, this._children)) {
                removeFromArray(this, child._parents);
                // adjust the combined bounds
                this.recalculateCombinedBounds();
            }

        }

        public unionCombinedBounds(rect: RectangleSD3) {
            if (this._combinedBounds.union(rect)) {
                for (var i in this._parents) {
                    var parent = this._parents[i];
                    parent.unionCombinedBounds(this._combinedBounds);
                }
            }
        }

        public adopt(child:ViewSVGGroupGraphNodeSD3) {
            child._parents.push(this);
            this._children.push(child);
            this.unionCombinedBounds(child._combinedBounds);
        }


        public insert(treeNode: ViewSVGGroupGraphNodeSD3, treeNodeBounds: RectangleSD3): { separate: boolean; node: ViewSVGGroupGraphNodeSD3; } {
            var result;
            if (this != treeNode) {
                var combinedBounds = this._combinedBounds;
                var combinedBoundsOverlaps = combinedBounds.overlaps(treeNode._combinedBounds);
                if (combinedBoundsOverlaps) {
                    var replace;
                    var renderBounds = this._render.getBounds();
                    var renderBoundsOverlaps = renderBounds.overlaps(treeNodeBounds);
                    if (renderBoundsOverlaps) {

                        var intersection = new RectangleSD3();
                        RectangleSD3.intersect(renderBounds, treeNodeBounds, intersection);
                        var cx = intersection.cx;
                        var cy = intersection.cy;
                        var depth = this._render.getScreenDepth(cx, cy);

                        if (depth != null) {
                            var treeNodeDepth = treeNode._render.getScreenDepth(cx, cy);
                            if (treeNodeDepth != null) {
                                replace = treeNodeDepth < depth;
                            } else {
                                replace = true;
                            }
                        } else {
                            replace = false;
                        }
                    } else {
                        replace = false;
                    }
                    if (replace) {
                        treeNode.adopt(this);
                        // at the top level we want this to replace the value
                        result = { separate: false, node: treeNode };
                    } else {
                        var adding = treeNode;
                        var addingBounds = treeNodeBounds;
                        var addingSeparate = !renderBoundsOverlaps;
                        var added = false;
                        //check the children
                        for (var i = this._children.length; i > 0;) {
                            i--;
                            var child = this._children[i];
                            var childCombinedBounds = child._combinedBounds;
                            if (childCombinedBounds.overlaps(addingBounds)) {
                                var newChild = child.insert(adding, addingBounds);
                                if (newChild) {
                                    if (newChild.node == adding) {
                                        // TODO check if it was added or was separate (do not disown child if it was separate)
                                        if (renderBoundsOverlaps && !newChild.separate) {
                                            this.disown(child);
                                        }
                                        //addingSeparate = newChild.separate || addingSeparate;
                                    } else {
                                        added = true;
                                        addingSeparate = false;
                                    }
                                }
                            }
                        }
                        if (addingSeparate) {
                            // it's a separate thing
                            result = { separate: true, node: adding };
                        } else {
                            // add it directly
                            if (!added) {
                                this.adopt(adding);
                            }
                            result = { separate: false, node: this };
                        }
                    }
                } else {
                    result = null;
                }
            } else {
                result = null;
            }
            return result;
        }

        public removeSelf(graph:ViewSVGGroupGraphSD3) {
            // remove self from parent node
            for (var i in this._parents) {
                var parent = this._parents[i];
                parent.disown(this);
            }
            for (var i in this._children) {
                // NOTE we are adding the child trees - seems wrong
                var child = this._children[i];
                removeFromArray(this, child._parents);
                graph.addTreeNode(child);
            }
            this._children = [];
            this._combinedBounds.copy(this._render.getBounds());
        }


        public foreach(iterator: (treeNode: ViewSVGGroupGraphNodeSD3) => void, walked:ViewSVGGroupGraphNodeSD3[] = []) {
            if (walked.indexOf(this) < 0) {
                walked.push(this);
                for (var i in this._children) {
                    var child = this._children[i];
                    child.foreach(iterator, walked);
                }
                // leaf-first
                iterator(this);
            }
        }

        public invalidate() {
            var children = this._children;
            for (var i in children) {
                var child = children[i];
                child.invalidate();
            }
            this._parents = [];
            this._children = [];
        }
    }
 }