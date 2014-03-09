///<reference path="IObjectPhysicalSD3.ts"/>
///<reference path="AbstractObjectSD3.ts"/>

module SD3 {

    export class AbstractObjectPhysicalSD3 extends AbstractObjectSD3 implements IObjectPhysicalSD3 {

        private _elementId: string;
        private _tempBounds: RectangleSD3;

        constructor(public _element: Element, _camera: CameraSD3, private _extents:PointSD3[], public _render:AbstractObjectPhysicalRenderSD3) {
            super(_camera);
            _render._object = this;
            _render._camera = _camera;
            this._tempBounds = new RectangleSD3();
        }

        public getElement() {
            return this._element;
        }

        public find(pathSpec: string, includeHidden?: boolean): NodeList {
            return this._element.querySelectorAll(pathSpec);
        }


        public getTransform(sx: number, sy: number, sz: number, zRotation: number): string {
            return "translate(" + sx.toFixed(PRECISION) + ", " + sy.toFixed(PRECISION) + ")";
        }

        // getBounds based on extents
        public getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            var cosZ = Math.cos(zRotation);
            var sinZ = Math.sin(zRotation);
            var cosX = this._camera.getRotationXCos();
            var sinX = this._camera.getRotationXSin();
            var first = true;
            for (var i in this._extents) {
                var extent = this._extents[i];
                var rx = extent.x * cosZ - extent.y * sinZ;
                var ry = extent.x * sinZ + extent.y * cosZ;

                // TODO apply some of these multipliers after discovering the min/max values
                var x = sx + rx;
                var y = sy + ry * cosX + extent.z * sinX;

                if (first) {
                    into.minX = x;
                    into.maxX = x;
                    into.minY = y;
                    into.maxY = y;
                    first = false;
                } else {
                    into.minX = Math.min(x, into.minX);
                    into.maxX = Math.max(x, into.maxX);
                    into.minY = Math.min(y, into.minY);
                    into.maxY = Math.max(y, into.maxY);
                }
            }
            return true;
        }


        public setElement(element: Element, view: IViewSD3) {
            this._element = element;
            if (this._elementId != null) {
                this._elementId = view.replace(this._elementId, element);
            }
        }


        public render(sx: number, sy: number, sz: number, zRotation: number, forceReorder: boolean): IObjectRenderSD3 {
            var bounds = this._render._bounds;
            this._tempBounds.copy(bounds);
            var inBounds = this.getBounds(bounds, sx, sy, zRotation);

            if (inBounds) {
                inBounds = this._view.isInView(bounds);
            } else if (inBounds == null) {
                // TODO remove
                // a bit of a hack to allow results to be included wholesale 
                inBounds = true;
            }
            var result;
            if (inBounds) {

                // set matrix to translate/scale/skew
                var transform = this.getTransform(sx, sy, sz, zRotation);
                if (transform != null) {
                    this._element.setAttribute("transform", transform);
                } else {
                    this._element.removeAttribute("transform");
                }

                if (this.visible) {
                    // do nothing if the element is already there
                    if (this._render.reset(sx, sy, sz, zRotation)) {
                        result = this._render;
                        if (forceReorder) {
                            this._elementId = this._view.reorder(this._elementId, this._tempBounds, this._render);
                        }
                    } else {
                        result = null;
                        // remove it
                        this._view.remove(this._elementId, this._tempBounds);
                        this._elementId = null;
                        this.visible = false;
                    }
                } else {
                    if (this._render.reset(sx, sy, sz, zRotation)) {
                        result = this._render;
                        this._elementId = this._view.add(this._element, this._render);
                        this.visible = true;
                    } else {
                        result = null;
                    }
                }
            } else {
                result = null;
                if (this.visible) {
                    this._view.remove(this._elementId, this._tempBounds);
                    this._elementId = null;
                    this.visible = false;
                }
            }
            return result;
        }


        public unrender() {
            var result = this.visible;
            if (result) {
                this._view.remove(this._elementId, this._render._bounds);
                this._elementId = null;
                // it's been removed
                this.visible = false;
            }
            return result;
        }


    }

} 