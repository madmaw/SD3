///<reference path="ViewSVGGroupSD3.ts"/>


module DD.SD3 {

    export class ViewSVGGroupMainSD3 extends ViewSVGGroupSD3 {

        public _width: number;
        public _height: number;
        public _viewBounds: RectangleSD3;
        public _viewScale: number;

        constructor(root: Element, public camera: CameraSD3, nodeList:IListSD3<ViewSVGGroupOrderedNodeSD3>) {
            super(root, nodeList);
            this._width = root.clientWidth;
            this._height = root.clientHeight;
            this._viewBounds = new RectangleSD3();
            this._viewScale = 1;
            this.setViewPosition(0, 0);
        }

        public setViewPosition(dx:number, dy:number) {
            this._viewBounds.minX = dx;
            this._viewBounds.minY = dy;
            this._viewBounds.maxX = dx + this._width;
            this._viewBounds.maxY = dy + this._height;
            this._adjustTransform();
        }

        public getScreenPoint(sx: number, sy: number): PointSD3 {
            var minX = this._viewBounds.minX;
            
            var minY = this._viewBounds.minY;

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
                minX = this._viewBounds.minX;
            }
            if (minY == null) {
                minY = this._viewBounds.minY;
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
            this._viewBounds.maxX = this._viewBounds.minX + this._width;
            this._viewBounds.maxY = this._viewBounds.minY + this._height;
        }

        public _adjustTransform() {
            this.root.setAttribute("transform", "translate(" + -this._viewBounds.minX.toFixed(PRECISION) + "," + -this._viewBounds.minY.toFixed(PRECISION) +") scale("+this._viewScale.toFixed(PRECISION)+")");
        }

        public begin(): ViewSVGGroupMainTransactionSD3 {
            return new ViewSVGGroupMainTransactionSD3(this);
        }

        isInView(rect: RectangleSD3): boolean {
            // scale the rect
            rect.scale(this._viewScale);
            return rect.overlaps(this._viewBounds);
            //return true;
        }

    }

}