module SD3 {

    export class ViewSVGGroupGraphSD3 implements IViewSD3 {

        public _rootNodes: ViewSVGGroupGraphNodeSD3[];
        public _bounds: RectangleSD3;
        private _allNodes: {[_: string ]:ViewSVGGroupGraphNodeSD3; };

        constructor(private _root:Element) {
            this._bounds = new RectangleSD3();
            this._rootNodes = [];
            this._allNodes = {};
        }

        get root(): Element {
            return this._root;
        }

        add(node: Node, render: IObjectRenderSD3): any {
            // walk the tree
            var treeNode = new ViewSVGGroupGraphNodeSD3(render, node);
            var renderId = render.id;
            (<Element>node).setAttribute("id", renderId);
            this._allNodes[renderId] = treeNode;
            this.addTreeNode(treeNode);
            return treeNode;
        }

        addTreeNode(treeNode: ViewSVGGroupGraphNodeSD3) {
            var adding = treeNode;
            var addingBounds = adding._render.getBounds();
            var addingSeparate = false;
            var added = false;
            var path = [];
            // TODO indexof is probably native and quicker
            for (var i = this._rootNodes.length; i > 0;) {
                i--;
                var rootNode = this._rootNodes[i];
                var replacement = rootNode.insert(adding, addingBounds, path);
                if (replacement) {
                    if (replacement.node == adding) {
                        if (!replacement.separate) {
                            this._rootNodes.splice(i, 1);
                            adding.adopt(rootNode);
                        }
                        addingSeparate = addingSeparate || replacement.separate;
                    } else {
                        added = true;
                    }
                }
            }
            if (!added) {
                this._rootNodes.push(adding);
                if (this._rootNodes.length > 10) {
                    console.log("getting a lot of root nodes ("+this._rootNodes.length+")!");
                }
            }
            this.insertInOrder(treeNode, path);
        }

        insertInOrder(treeNode: ViewSVGGroupGraphNodeSD3, path: ViewSVGGroupGraphNodeSD3[]) {
            if (path.indexOf(treeNode) < 0) {
                path.push(treeNode);
                // 
                var childNodes = this._root.childNodes;
                var maxIndex: number = null;
                var parents = treeNode._parents;
                outer: for (var i = 0; i < childNodes.length; i++) {
                    var childNode = childNodes.item(i);
                    // is it a parent?
                    if (maxIndex == null) {
                        // TODO could just break outer here
                        for (var j in parents) {
                            var parent = parents[j];
                            if (parent._renderedNode == childNode) {
                                maxIndex = i;
                                break outer;
                            }
                        }
                    }
                }
                // insert just after the minimum index
                if (maxIndex != null) {
                    var minParentNode = childNodes.item(maxIndex);
                    this._root.insertBefore(treeNode._renderedNode, minParentNode);

                    // TODO child nodes will have changed size, do we need to get it again?
                    // +2 because we want to skip ourselves and the node that we just added ourselves behind
                    var displacedChildren = [];
                    var children = treeNode._children;
                    for (var i = childNodes.length; i > maxIndex + 2;) {
                        i--;
                        var childNode = childNodes[i];
                        for (var j in children) {
                            var child = children[j];
                            if (child._renderedNode == childNode) {
                                displacedChildren.push(child);
                                break;
                            }
                        }
                    }
                    for (var j in displacedChildren) {
                        var displacedChild = displacedChildren[j];
                        this.insertInOrder(displacedChild, path);
                    }
                } else {
                    this._root.appendChild(treeNode._renderedNode);
                }
                path.splice(path.length - 1, 1);
            }
        }

        remove(nodeId: any, previousBounds: RectangleSD3): void {
            var treeNode = <ViewSVGGroupGraphNodeSD3>nodeId;
            delete this._allNodes[treeNode._render.id];
            this.removeTreeNode(treeNode);
            //this.redraw();
        }

        removeRootNode(treeNode: ViewSVGGroupGraphNodeSD3) {
            var index = this._rootNodes.indexOf(treeNode);
            if (index >= 0) {
                // remove the root first otherwise all the children will just get added to it again!
                this._rootNodes.splice(index, 1);
            }
        }

        removeTreeNode(treeNode: ViewSVGGroupGraphNodeSD3) {
            this.removeRootNode(treeNode);
            treeNode.removeSelf(this);
            // don't need to reorder the children - they're still valid
            // remove the render
            try {
                this._root.removeChild(treeNode._renderedNode);
            } catch (e) {
                console.log("tried to remove non-existant node");
                console.log(e);
            }
            //this.redraw();
        }

        reorder(nodeId: any, previousBounds: RectangleSD3, render: IObjectRenderSD3): any {
            var treeNode = <ViewSVGGroupGraphNodeSD3>nodeId;
            treeNode.setRender(render);
            this.removeTreeNode(treeNode);
            this.addTreeNode(treeNode);
            return treeNode;
        }

        replace(nodeId: any, node: Node): any {
            var treeNode = <ViewSVGGroupGraphNodeSD3>nodeId;
            var oldNode = treeNode._renderedNode;
            treeNode._renderedNode = node;
            if (oldNode) {
                this._root.insertBefore(node, oldNode);
                this._root.removeChild(oldNode);
            } else {
                this.redraw();
            }
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
                return true;
            });
        }

        foreach(f: (node: ViewSVGGroupGraphNodeSD3) => boolean): boolean {
            var walked = [];
            var result = true;
            for (var i in this._rootNodes) {
                var rootNode = this._rootNodes[i];
                result = rootNode.foreach(f, walked);
                if (!result) {
                    break;
                }
            }
            return result;
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