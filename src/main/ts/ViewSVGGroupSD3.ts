module SD3 {

    export class ViewSVGGroupSD3 implements IViewSD3 {

        

        constructor(public root: Element, public _nodes: IListSD3<ViewSVGGroupOrderedNodeSD3>) {
            this.invalidate();
        }

        add(node: Node, bounds: RectangleSD3, render: IObjectRenderSD3): any {
            var o = new ViewSVGGroupOrderedNodeSD3(node, bounds, render);
            var after = this._nodes.insert(o);
            // add the node before the object at the position (if any)
            if (after != null) {
                this.root.insertBefore(node, after.node);
            } else {
                this.root.appendChild(node);
            }
            return node;
        }

        remove(id: any): void {
            this._removeNode(id);
        }

        public _removeNode(id: any): Node {
            var node = <Node>id;
            this.root.removeChild(node);
            this._nodes.remove((o: ViewSVGGroupOrderedNodeSD3) => {
                var result: ListRemoveResultSD3;
                if (o.node == id) {
                    result = ListRemoveResultSD3.DELETE_BREAK;
                } else {
                    result = ListRemoveResultSD3.CONTINUE;
                }
                return result;
            });
            return node;
        }

        public invalidate() {
            this._nodes = this._nodes.empty();
        }

        reorder(id: any, bounds: RectangleSD3, render:IObjectRenderSD3): any {
            var node = this._removeNode(id);
            var result;
            if (node != null) {
                result = this.add(node, bounds, render);
            } else {
                result = null;
            }
            return result;
        }

        replace(id: any, node: Node): any {
            // do not reorder, just set the new node
            var found = this._nodes.foreach(function (orderedNode: ViewSVGGroupOrderedNodeSD3) {
                if (orderedNode.node == id) {
                    orderedNode.node = node;
                    return false;
                } else {
                    return true;
                }
            });
            if (found) {
                return id;
            } else {
                return null;
            }
        }

        isInView(rect: RectangleSD3): boolean {
            return true;
        }

        public clone(): IViewSD3 {
            return new ViewSVGGroupSD3(<Element>this.root.cloneNode(false), this._nodes.empty());
        }
    }
} 