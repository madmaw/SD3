///<reference path="ObjectGroupSD3.ts"/>
///<reference path="IObjectPhysicalSD3.ts"/>
///<reference path="IViewSD3.ts"/>

module SD3 {

    export class ObjectGroupPhysicalSD3 extends ObjectGroupSD3 implements IObjectPhysicalSD3 {

        private _previousBounds: RectangleSD3;
        private _bounds: RectangleSD3;
        private _groupElementId: any;
        private _groupElement: Element;

        constructor(camera:CameraSD3, public _physicalView:IViewSD3, render:CompositeObjectRenderSD3 = new CompositeObjectRenderSD3()) {
            super(camera, render);
            this._groupElement = this._physicalView.root;
            this._previousBounds = new RectangleSD3();
        }

        public getElement() {
            return this._groupElement;
        }

        public find(pathSpec: string, includeHidden?: boolean): NodeList {
            var result: NodeList;
            if (includeHidden) {
                // combine into one node list
                var nodeLists = [];
                nodeLists.push(this._groupElement.querySelectorAll(pathSpec));
                for (var i in this._objects) {
                    var object = this._objects[i];
                    if (object.hidden || !object.object.visible) {
                        var physicalObject = <IObjectPhysicalSD3>object.object;
                        if (physicalObject.find) {
                            var subNodeList = physicalObject.find(pathSpec, true);
                            nodeLists.push(subNodeList);
                        }
                    }
                }
                result = new CompositeNodeListSD3(nodeLists);
            } else {
                result = this._groupElement.querySelectorAll(pathSpec);
            }
            return result;
        }
        
        
        public _getObjectView(id: string, object: IObjectSD3) {
            return this._physicalView;
        }

        render(sx: number, sy: number, sz: number, zRotation: number, forceReorder: boolean): IObjectRenderSD3 {
            var bounds = this._render.getBounds();
            this._previousBounds.copy(bounds);
            var visible = this.getBounds(bounds, sx, sy, zRotation);
            if (visible) {
                visible = this._view.isInView(bounds);
            } else if (visible == null) {
                // TODO remove
                // a bit of a hack to allow results to be included wholesale 
                visible = true;
            }
            var result: CompositeObjectRenderSD3;
            if (visible) {
                this._render.reset(sx, sy, sz, zRotation);
                this.renderInto(this._render, 0, 0, 0, zRotation, false);
                visible = !this._render.empty;
            }
            if( visible ) {
                result = this._render;
                result.onLoaded();

                // set matrix to translate only
                var transform = "translate(" + sx.toFixed(PRECISION) + "," + sy.toFixed(PRECISION) + ")";
                this._groupElement.setAttribute("transform", transform);

                if (this.visible) {
                    // do nothing if the element is already there
                    if (forceReorder) {
                        this._groupElementId = this._view.reorder(this._groupElementId, this._previousBounds, result);
                    }
                } else {
                    this._groupElementId = this._view.add(this._groupElement, result);
                    this.visible = true;
                }
            } else {
                result = null;
                if (this.visible) {
                    this._view.remove(this._groupElementId, this._previousBounds);
                    this._groupElementId = undefined;
                    this.visible = false;
                }
            }
            return result;
            
        }

        unrender():boolean {
            // do not unrender everything, just remove the element
            var result = this.visible;
            if (result) {
                this._view.remove(this._groupElementId, this._render.getBounds());
                this._groupElementId = undefined;
                this.visible = null;
            }
            return result;
        }

        clone(): IObjectSD3 {
            // NOTE: we don't want a deep copy as the children will add their nodes as part of copy into!
            var result = new ObjectGroupPhysicalSD3(
                this._camera,
                this._physicalView.clone(),
                <CompositeObjectRenderSD3>this._render.clone()
            );
            this.copyInto(result);
            return result;
        }
    }

} 