module SD3 {
    
    export class ViewSVGGroupGraphNodeSD3 {
        
        public static OVERLAP_MARGIN: number = 0.1;

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

        public adopt(child: ViewSVGGroupGraphNodeSD3) {
            if (this.isDescendant(child)) {
                //throw "I'm your child you sick fuck";
                console.log("attempted to add circular inheritance (via child)");
            } else if (child.isAncestor(this)) {
                //throw "that's your father you sick fuck";
                console.log("attempted to add circular inheritance (via parent)");
            } else if (child._parents.indexOf(this) < 0) {
                child._parents.push(this);
                this._children.push(child);
                this.unionCombinedBounds(child._combinedBounds);
            }
        }


        public insert(treeNode: ViewSVGGroupGraphNodeSD3, treeNodeBounds: RectangleSD3, path:ViewSVGGroupGraphNodeSD3[]): { separate: boolean; node: ViewSVGGroupGraphNodeSD3; } {
            var result;
            path.push(this);
            // TODO remove this check?
            // should never happen unless the objects phsically overlap
            var isInPath = path.indexOf(treeNode) >= 0;
            if (!isInPath) {
            
                var combinedBounds = this._combinedBounds;
                var combinedBoundsOverlaps = combinedBounds.overlapsByMargin(treeNode._combinedBounds, ViewSVGGroupGraphNodeSD3.OVERLAP_MARGIN);
                if (combinedBoundsOverlaps) {
                    var replace;
                    var renderBounds = this._render.getBounds();
                    var renderBoundsOverlaps = renderBounds.overlapsByMargin(treeNodeBounds, ViewSVGGroupGraphNodeSD3.OVERLAP_MARGIN);
                    if (renderBoundsOverlaps) {

                        var intersection = new RectangleSD3();
                        RectangleSD3.intersect(renderBounds, treeNodeBounds, intersection);
                        var cx = intersection.cx;
                        var cy = intersection.cy;
                        
                        var depth = this._render.getScreenDepth(cx, cy);
                        
                        if (depth != null) {
                            var treeNodeDepth = treeNode._render.getScreenDepth(cx, cy);
                            if (treeNodeDepth != null) {
                                var diff = treeNodeDepth - depth;
                                var confidence = Math.min(intersection.width, intersection.height) * Math.abs(diff);
                                if (confidence < 5) {
                                    // almost equal, doesn't overlap
                                    replace = false;
                                    renderBoundsOverlaps = false;
                                } else {
                                    replace = diff < 0;
                                }
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
                        // let the caller do this...
                        //treeNode.adopt(this);
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
                            if (childCombinedBounds.overlapsByMargin(addingBounds, ViewSVGGroupGraphNodeSD3.OVERLAP_MARGIN)) {
                                
                                var newChild = child.insert(adding, addingBounds, path);

                                if (newChild) {
                                    if (newChild.node == adding) {
                                        // TODO check if it was added or was separate (do not disown child if it was separate)
                                        if (!newChild.separate) {
                                            if (renderBoundsOverlaps) {
                                                this.disown(child);
                                            }
                                            adding.adopt(child);
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
            // remove self from path
            path.splice(path.length - 1, 1);
            return result;
        }

        public removeSelf(graph: ViewSVGGroupGraphSD3) {
            // remove self from parent node

            // copy the parents, we'll need them in a minute (kind of cheat by reassigning to empty)
            /*
            var parents = this._parents;
            this._parents = [];

            // remove self from parents
            for (var i = parents.length; i > 0;) {
                i--;
                var parent = parents[i];
                parent.disown(this);
            }
            graph.removeRootNode(this);

            // add the children to the parents
            for (var i = this._children.length; i > 0;) {
                i--;
                var child = this._children[i];

                child.inheritAncestors(parents, graph);
            }
            */
            // TODO there's probably a more efficient way of doing this (above doesn't quite work)
            var all = [];
            this.disintegrate(all);
            for (var i in all) {
                var node = all[i];
                graph.removeRootNode(node);
                if (node != this) {
                    // do not add self back in
                    graph.addTreeNode(node);
                }
            }

        }

        public inheritAncestors(ancestors: ViewSVGGroupGraphNodeSD3[], graph: ViewSVGGroupGraphSD3) {
            // I think we want the render bounds, not the combined bounds
            var descendantBounds = this._render.getBounds();
            for (var i in ancestors) {
                var ancestor = ancestors[i];
                if (ancestor._combinedBounds.overlapsByMargin(descendantBounds, ViewSVGGroupGraphNodeSD3.OVERLAP_MARGIN)) {
                    ancestor.adopt(this);
                } else {
                    // well I guess it overlaps with their ancestor
                    var previousAncestors = ancestor._parents;
                    if (previousAncestors.length == 0) {
                        graph.addRootNode(this);
                    } else {
                        this.inheritAncestors(previousAncestors, graph);
                    }
                }
            }
        }

        public disintegrate(descendants: ViewSVGGroupGraphNodeSD3[]) {
            descendants.push(this);
            for (var i = this._children.length; i > 0;) {
                i--;
                var child = this._children[i];
                if (child) {
                    child.disintegrate(descendants);
                }
            }
            // remove self from all parents
            for (var i = this._parents.length; i > 0;) {
                i--;
                var parent = this._parents[i];
                parent.disown(this);
            }
            this._children = [];
            this._parents = [];
            this._combinedBounds.copy(this._render.getBounds());
        }


        public foreach(iterator: (treeNode: ViewSVGGroupGraphNodeSD3) => boolean, walked: ViewSVGGroupGraphNodeSD3[]= []): boolean {
            var result = true;
            if (walked.indexOf(this) < 0) {
                walked.push(this);
                for (var i in this._children) {
                    var child = this._children[i];
                    result = child.foreach(iterator, walked);
                    if (!result) {
                        break;
                    }
                }
                if (result) {
                    // leaf-first
                    result = iterator(this);
                }
            }
            return result;
        }

        public invalidate(recursive: boolean = true) {
            if (recursive) {
                var children = this._children;
                for (var i in children) {
                    var child = children[i];
                    child.invalidate();
                }
            }
            this._parents = [];
            this._children = [];
            
        }

        public isAncestor(treeNode: ViewSVGGroupGraphNodeSD3): boolean {
            var result;
            if (this._children.indexOf(treeNode) >= 0) {
                result = true;
            } else {
                result = false;
                for (var i in this._children) {
                    var child = this._children[i];
                    if (child.isAncestor(treeNode)) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }

        public isDescendant(treeNode: ViewSVGGroupGraphNodeSD3): boolean {
            var result;
            if (this._parents.indexOf(treeNode) >= 0) {
                result = true;
            } else {
                result = false;
                // check parent's parents
                for (var i in this._parents) {
                    var parent = this._parents[i];
                    if (parent.isDescendant(treeNode)) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }
    }
 }