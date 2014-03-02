module DD.SD3 {

    export class ViewSVGGroupMainTransactionSD3 {

        private _originalViewX: number;
        private _originalViewY: number;
        private _originalViewRotationZ: number;
        private _originalViewScale: number;
        private _tempPoint: PointSD3;
        private _viewRotationZDelta: number;
        
        constructor(private _view: ViewSVGGroupMainSD3) {
            this._originalViewX = this._view._viewBounds.minX;
            this._originalViewY = this._view._viewBounds.minY;
            this._originalViewScale = this._view._viewScale;
            this._originalViewRotationZ = this._view.camera.getRotationZ();
            this._tempPoint = new PointSD3();
            this._viewRotationZDelta = 0;
        }

        public setViewPositionOffset(dx: number, dy: number) {
            this._view.setViewPosition(this._originalViewX + dx, this._originalViewY + dy);
            // don't need to worry about scale or offset?
        }

        public setViewRotationZOffset(drz: number, aroundX: number, aroundY: number) {
            /*
            var cx = this._originalViewX + aroundX;
            var cy = this._originalViewY + aroundY;

            var vx = (cx / scale);
            var vy = (cy / scale) / this._view.camera.getRotationXCos();

            var sin = Math.sin(drz);
            var cos = Math.cos(drz);

            var rx = vx * cos - vy * sin;
            var ry = vy * cos + vx * sin;
            */
            this._viewRotationZDelta = drz;
            var oldScale = this._view._viewScale;
            this._view.getWorldPoint(aroundX, aroundY, this._tempPoint, this._originalViewX, this._originalViewY, drz);
            var rx = this._tempPoint.x;
            var ry = this._tempPoint.y;
            var sx = rx * oldScale - aroundX;
            var sy = ry * this._view.camera.getRotationXCos() * oldScale - aroundY;
            this._view.setViewPosition(sx, sy);
            this._view.camera.setRotationZ(this._originalViewRotationZ + drz);
        }

        public multiplyViewScale(scale: number, intoX: number, intoY: number) {

            // account for rotation
            var oldScale = this._view._viewScale;
            this._view.getWorldPoint(intoX, intoY, this._tempPoint, this._originalViewX, this._originalViewY, this._viewRotationZDelta);
            var rx = this._tempPoint.x;
            var ry = this._tempPoint.y;
            var cx = rx * oldScale;
            var cy = ry * this._view.camera.getRotationXCos() * oldScale;

            var newScale = scale * this._originalViewScale;
            this._view._viewScale = newScale;
            //var cx = this._originalViewX + intoX;
            //var cy = this._originalViewY + intoY;
            this._view.setViewPosition(cx * scale - intoX, cy * scale - intoY);
            // TODO ensure that view bounds stay centred while scaling
            this._view._adjustTransform();
        }
    }
} 