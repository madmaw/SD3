///<reference path="AbstractObjectSD3.ts"/>

module SD3 {


    export class ObjectGroupSD3 extends AbstractObjectSD3 {

        public _objects: { [_: string]: ISubObjectSD3 };

        private _sx: number;
        private _sy: number;
        private _sz: number;
        private _zRotation: number;
        private _sinZ: number;
        private _cosZ: number;
        private _tempBounds: RectangleSD3;
        private _viewOwner: boolean;


        constructor(camera: CameraSD3, public _render:CompositeObjectRenderSD3 = new CompositeObjectRenderSD3()) {
            super(camera);
            this._objects = {};
            this._tempBounds = new RectangleSD3();
            _render._object = this;
            _render._camera = camera;
        }

        public setView(view: IViewSD3, owner?: boolean) {
            super.setView(view);
            this._viewOwner = owner;
        }

        public setObject(id: string, object: IObjectSD3, offset: PointSD3, zRotation: number, render?: boolean, suppressChangeEvent?:boolean) {
            var view = this._getObjectView(id, object);
            var o: ISubObjectSD3;
            var boundsChangeListener = (changed:IObjectSD3) => {
                // reorder the object
                this.renderObject(o.object, o.offset, o.zRotation, true);
            };
            object.setView(view);
            
            object.addChangeListener(boundsChangeListener);
            o = { offset: offset, zRotation: zRotation, object: object, hidden: false, boundsChangeListener: boundsChangeListener };
            this._objects[id] = o;
            if (render) {
                this.renderObject(object, offset, zRotation, true);
            }
            if (!suppressChangeEvent) {
                this._fireChangeEvent();
            }
        }

        public getObject(id: string): IObjectSD3 {
            var result: IObjectSD3;
            var o = this._objects[id];
            if (o != null) {
                result = o.object;
                result.removeChangeListener(o.boundsChangeListener);
            } else {
                result = null;
            }
            return result;
        }

        public _getObjectView(id: string, object: IObjectSD3) {
            return this._view;
        }

        public removeObject(id: string, unrender?:boolean, suppressChangeEvent?:boolean) {
            var object = this._objects[id];
            if (object != null) {
                // remove the rendered stuff from this?
                if (unrender) {
                    object.object.unrender();
                }
                delete this._objects[id];
                if (!suppressChangeEvent) {
                    this._fireChangeEvent();
                }
            }

        }

        public getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            // union all the sub-parts
            var first = true;
            var result = false;
            for (var i in this._objects) {
                var o = this._objects[i];
                var r;
                if (first) {
                    r = into;
                } else {
                    r = this._tempBounds;
                }
                var hasBounds = o.object.getBounds(r, sx, sy, zRotation);
                if (hasBounds) {
                    result = true;
                    if (first) {
                        first = false;
                    } else {
                        into.union(r);
                    }
                }
            }
            return result;
        }

        render(sx: number, sy: number, sz: number, zRotation: number, forceReorder: boolean): IObjectRenderSD3 {
            var result = this._render;
            result.reset(0, 0, 0, zRotation);
            this.renderInto(result, sx, sy, sz, zRotation, forceReorder);
            result.onLoaded();
            if (result.empty) {
                // not in view
                result = null;
            }
            return result;
        }

        renderInto(render: CompositeObjectRenderSD3, sx: number, sy: number, sz: number, zRotation: number, forceReorder: boolean) {
            this._sinZ = Math.sin(zRotation);
            this._cosZ = Math.cos(zRotation);
            this._zRotation = zRotation;
            this._sx = sx;
            this._sy = sy;
            this._sz = sz;
            var visible = false;
            if (this._viewOwner && forceReorder) {
                // invalidate the view for a full reorder
                this._view.invalidate();
            }
            for (var i in this._objects) {
                var o = this._objects[i];
                if (!o.hidden) {
                    var objectRender = this.renderObject(o.object, o.offset, o.zRotation, forceReorder);
                    if (objectRender) {
                        render.add(i, objectRender, false);
                    }
                }
            }
        }

        unrender(): boolean {
            var result = false;
            for (var i in this._objects) {
                var o = this._objects[i];
                result = o.object.unrender() || result;
            }
            return result;
        }

        public show(id: string) {
            var o = this._objects[id];
            if (o != null && o.hidden) {
                this.renderObject(o.object, o.offset, o.zRotation, true);
                o.hidden = false;
            }
        }

        public showAll() {
            for (var i in this._objects) {
                this.show(i);
            }
        }

        public hide(id: string) {
            var o = this._objects[id];
            if (o != null && !o.hidden) {
                o.object.unrender();
                o.hidden = true;
            }
        }

        public setVisible(id: string, visible: boolean) {
            if (visible) {
                this.show(id);
            } else {
                this.hide(id);
            }
        }

        /*
        public _getScreenDepthSource(object: ISubObjectSD3, sx: number, sy: number, sz: number, zRotation: number): IScreenDepthSourceSD3 {
            var offset = object.offset;
            var sinZ = Math.sin(zRotation);
            var cosZ = Math.cos(zRotation);
            var sinX = this._camera.getRotationXSin();
            var cosX = this._camera.getRotationXCos();
            var osx = sx + offset.x * cosZ - offset.y * sinZ;
            var dy = offset.x * this._sinZ + offset.y * cosZ;
            var osy = sy + dy * cosX + offset.z * sinX;
            var osz = sz + offset.z * cosX - dy * sinX;
            return object.object.getScreenDepthSource(osx, osy, osz, zRotation + object.zRotation);
        }
        */

        public renderObject(object:IObjectSD3, offset:PointSD3, zRotation:number, forceReorder:boolean): IObjectRenderSD3 {
            var sinX = this._camera.getRotationXSin();
            var cosX = this._camera.getRotationXCos();
            var osx = this._sx + offset.x * this._cosZ - offset.y * this._sinZ;
            var dy = offset.x * this._sinZ + offset.y * this._cosZ;
            var osy = this._sy + dy * cosX + offset.z * sinX;
            var osz = this._sz + offset.z * cosX - dy * sinX;
            return object.render(osx, osy, osz, zRotation + this._zRotation, forceReorder);
        }

        public clone(): IObjectSD3 {
            var result = new ObjectGroupSD3(this._camera, <CompositeObjectRenderSD3>this._render.clone()); 
            this.copyInto(result);
            return result;
        }

        public copyInto(objectGroup: ObjectGroupSD3) {
            for (var i in this._objects) {
                var o = this._objects[i];
                var clone = o.object.clone();
                var offset = o.offset.clone();
                var zRotation = o.zRotation;
                objectGroup.setObject(i, clone, offset, zRotation, false);
            }
        }
    }

} 