///<reference path="ViewSVGGroupTreeSD3.ts"/>


module SD3 {

    export class ViewSVGGroupMainSD3 extends ViewSVGGroupTreeSD3 {

        public _width: number;
        public _height: number;
        public _viewScale: number;

        constructor(root: Element, public camera: CameraSD3, groupPrototype:Element) {
            super(groupPrototype);
            this._width = root.clientWidth;
            this._height = root.clientHeight;
            this._viewScale = 1;
            this.setViewPosition(0, 0);
            // add it in
            root.appendChild(this._rootNode._groupElement);
        }

        public setViewPosition(dx:number, dy:number) {
            this._bounds.minX = dx;
            this._bounds.minY = dy;
            this._bounds.maxX = dx + this._width;
            this._bounds.maxY = dy + this._height;
            this._adjustTransform();
        }

        public getScreenPoint(sx: number, sy: number): PointSD3 {
            var minX = this._bounds.minX;
            
            var minY = this._bounds.minY;

            var cx = minX + sx;
            var cy = minY + sy;

            var vx = (cx / this._viewScale);
            var vy = (cy / this._viewScale);
            return new PointSD3(vx, vy);
        }

        public getWorldPoint(sx: number, sy: number, into?: PointSD3, minX?:number, minY?:number, rotation?: number): PointSD3 {
            if (rotation == null) {
                rotation = -this.camera.getRotationZ();
            }
            if (minX == null) {
                minX = this._bounds.minX;
            }
            if (minY == null) {
                minY = this._bounds.minY;
            }
            var cx = minX + sx;
            var cy = minY + sy;

            var vx = (cx / this._viewScale);
            var vy = (cy / this._viewScale) / this.camera.getRotationXCos();

            var sin = Math.sin(rotation);
            var cos = Math.cos(rotation);

            var tx = vx * cos - vy * sin;
            var ty = vy * cos + vx * sin;
            var tz = 0;//(this._viewBounds.minY + sy) / this.camera.getRotationXSin();
            if (into == null) {
                into = new PointSD3(tx, ty, tz);
            } else {
                into.x = tx;
                into.y = ty;
                into.z = tz;
            }
            return into;
        }

        public setViewDimensions(width:number, height:number) {
            this._width = width;
            this._height = height;
            this._bounds.maxX = this._bounds.minX + this._width;
            this._bounds.maxY = this._bounds.minY + this._height;
        }

        public _adjustTransform() {
            this.root.setAttribute("transform", "translate(" + -this._bounds.minX.toFixed(PRECISION) + "," + -this._bounds.minY.toFixed(PRECISION) +") scale("+this._viewScale.toFixed(PRECISION)+")");
        }

        public begin(): ViewSVGGroupMainTransactionSD3 {
            return new ViewSVGGroupMainTransactionSD3(this);
        }

        isInView(rect: RectangleSD3): boolean {
            // scale the rect
            rect.scale(this._viewScale);
            return rect.overlaps(this._bounds);
            //return true;
        }

    }

}