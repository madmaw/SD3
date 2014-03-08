module SD3 {

    export class ObjectGroupCubeRenderSD3 extends CompositeObjectRenderSD3 {

        private _zRotation: number;
        private _maxYX: number;
        private _maxY: number;
        private _rightTan: number;
        private _rightRender: IObjectRenderSD3;
        private _leftTan: number;
        private _leftRender: IObjectRenderSD3;
        private _topRender: IObjectRenderSD3;

        constructor() {
            super();
        }

        public getScreenDepth(x: number, y: number): number {

            var dx = x - this._maxYX;
            var sdy = y - this._maxY;
            var dy = sdy / this._camera.getRotationXCos();
            var render: IObjectRenderSD3;
            if (dx > 0) {
                // check the right
                var ty = this._rightTan * dx;
                if (ty > dy) {
                    // use top
                    render = this._topRender;
                } else {
                    if (this._rightRender != null) {
                        // use right face
                        render = this._rightRender;
                    } else if (this._leftRender != null) {
                        render = this._leftRender;
                    } else {
                        render = this._topRender;
                    }
                }
            } else {
                // check the left
                var ty = this._leftTan * dx;
                if (ty > dy) {
                    // use top
                    render = this._topRender;
                } else {
                    if (this._leftRender != null) {
                        // use left face
                        render = this._leftRender;
                    } else if (this._rightRender != null) {
                        render = this._rightRender;
                    } else {
                        render = this._topRender;
                    }
                }
            }
            var result: number;
            if (render != null) {
                result = this.getScreenDepthForRender(render, x, y);
            } else {
                result = null;
            }
            return result;
        }

        public reset(sx: number, sy: number, sz: number, zRotation: number): void {
            super.reset(sx, sy, sz, zRotation);
            this._zRotation = zRotation;
        }

        public onLoaded() {
            var cube = <ObjectGroupCubeSD3>this._object;
            var dx = cube._width / 2;
            var dy = cube._height / 2;
            var h = Math.sqrt(dx * dx + dy * dy);
            var angle = this._zRotation - Math.PI / 4;
            var maxAngle = null;
            var maxY = null;
            var maxFace = null;
            for (var i in ObjectGroupCubeSD3.CARDINAL_FACES) {
                var sin = Math.sin(angle);
                var ry = sin * h;
                if (maxY == null || ry > maxY) {
                    maxY = ry;
                    maxAngle = angle;
                    maxFace = i;
                }
                angle += Math.PI / 2;
            }
            this._maxY = this._sy + maxY * this._camera.getRotationXCos();
            this._maxYX = this._sx + Math.cos(maxAngle) * h;
            var leftFace = ObjectGroupCubeSD3.CARDINAL_FACES[maxFace];
            this._leftRender = this._renders[leftFace];
            var leftAngle = maxAngle + Math.PI * 3 / 4;
            this._leftTan = Math.tan(leftAngle);

            var rightFaceIndex = maxFace - 1;
            if (rightFaceIndex < 0) {
                rightFaceIndex += ObjectGroupCubeSD3.CARDINAL_FACES.length;
            }
            var rightFace = ObjectGroupCubeSD3.CARDINAL_FACES[rightFaceIndex];
            this._rightRender = this._renders[rightFace];
            var rightAngle = maxAngle - Math.PI * 3 / 4;
            this._rightTan = Math.tan(rightAngle);

            var topFace = ObjectGroupCubeSD3.FACE_TOP;
            this._topRender = this._renders[topFace];

        }

        public clone(): IObjectRenderSD3 {
            return new ObjectGroupCubeRenderSD3();
        }

    }

} 