module SD3 {

    export class ObjectGroupCubeRenderSD3 extends CompositeObjectRenderSD3 {

        private _zRotation: number;

        private _maxY: number;
        private _maxYX: number;
        private _maxYZ: number;

        private _minX: number;
        private _minXY: number;
        private _minXZ: number;

        private _rightTan: number;
        private _rightRender: IObjectRenderSD3;
        private _leftTan: number;
        private _leftRender: IObjectRenderSD3;
        private _topRender: IObjectRenderSD3;

        constructor(private _depth:number) {
            super();
        }

        public getScreenDepth(x: number, y: number): number {

            // don't use subordinate renderers, work it out yourself (otherwise you get issues with hidden faces)

            var top = false;
            var left = false;
            var right = false;
            
            var dx = x - this._maxYX;
            var sdy = y - this._maxY;
            var dy = sdy / this._camera.getRotationXCos();
            var render: IObjectRenderSD3;
            if (!isAlmostZero(this._camera.getRotationX())) {
                if (dx > 0) {
                    // check the right
                    var ty = this._rightTan * dx;
                    if (ty > dy) {
                        // use top
                        render = this._topRender;
                        top = true;
                    } else {
                        right = true;

                        if (this._rightRender != null) {
                            // use right face
                            render = this._rightRender;
                        } /* else if (this._leftRender != null) {
                            render = this._leftRender;
                        } else {
                            render = this._topRender;
                        } */

                    }
                } else {
                    // check the left
                    var ty = this._leftTan * dx;
                    if (ty > dy) {
                        // use top
                        top = true;
                        render = this._topRender;
                    } else {
                        left = true;

                        if (this._leftRender != null) {
                            // use left face
                            render = this._leftRender;
                        } /* else if (this._rightRender != null) {
                            render = this._rightRender;
                        } else {
                            render = this._topRender;
                        }*/

                    }
                }
            } else {
                top = true;
                render = this._topRender;
            }
            var result: number;
            if (top) {
                // top
                var tanX = this._camera.getRotationXTan();
                var dsy = y - this._sy;
                //var dy = dsy / cosX;
                var dsz = dsy * tanX;
                // minus it because....?
                result = this._sz - dsz;
            } else {
                var asx;
                var asy;
                var asz;
                var tanZ;
                if (left) {
                    // the left
                    // TODO calculate the offset
                    asx = this._minX;
                    asy = this._minXY;
                    asz = this._minXZ;
                    tanZ = this._leftTan;
                } else {
                    // the right 
                    asx = this._maxYX;
                    asy = this._maxY;
                    asz = this._maxYZ;
                    tanZ = this._rightTan
                }

                var sinX = this._camera.getRotationXSin();
                var cosX = this._camera.getRotationXCos();

                var sdx = x - asx;
                var sdy = y - asy;
                var dzatdx = sdx * tanZ;
                var sdyatdx = dzatdx * cosX;
                var dy = (sdy - sdyatdx) / sinX;

                //dy = Math.min(Math.max(0, dy), this._depth);

                var invTanX = Math.tan(Math.PI / 2 - this._camera.getRotationX());
                var sdz = dy * invTanX - dzatdx * sinX;
                result = asz + sdz;

            }
            if (render != null) {
                var compareResult = this.getScreenDepthForRender(render, x, y);
                var compareDiff = compareResult - result;
                if (Math.abs(compareDiff) > 1) {
                    console.log("results don't match!");
                    var compareResult = this.getScreenDepthForRender(render, x, y);
                }
            }
            return result;
        }

        public reset(sx: number, sy: number, sz: number, zRotation: number): void {
            this._zRotation = zRotation;
            super.reset(sx, sy, sz, zRotation);
        }

        public onLoaded() {
            var cube = <ObjectGroupCubeSD3>this._object;
            var dx = cube._width / 2;
            var dy = cube._height / 2;
            var h = Math.sqrt(dx * dx + dy * dy);
            var angle = this._zRotation - Math.PI / 4;
            var maxYAngle = null;
            var maxY = null;
            var maxFace = null;
            
            
            for (var i in ObjectGroupCubeSD3.CARDINAL_FACES) {
                var sin = Math.sin(angle);
                var ry = sin * h;
                if (maxY == null || ry > maxY) {
                    maxY = ry;
                    maxYAngle = angle;
                    maxFace = i;
                }
                angle += Math.PI / 2;
            }
            this._maxY = this._sy + maxY * this._camera.getRotationXCos();
            this._maxYX = this._sx + Math.cos(maxYAngle) * h;
            this._maxYZ = this._sz - maxY * this._camera.getRotationXSin();

            var minXAngle = maxYAngle + Math.PI / 2;
            var minX = Math.cos(minXAngle) * h;
            var minXY = Math.sin(minXAngle) * h;
            this._minX = this._sx + minX;
            this._minXY = this._sy + minXY * this._camera.getRotationXCos();
            this._minXZ = this._sz - minXY * this._camera.getRotationXSin();

            var leftFace = ObjectGroupCubeSD3.CARDINAL_FACES[maxFace];
            this._leftRender = this._renders[leftFace];
            var leftAngle = maxYAngle + Math.PI * 3 / 4;
            this._leftTan = Math.tan(leftAngle);

            var rightFaceIndex = maxFace - 1;
            if (rightFaceIndex < 0) {
                rightFaceIndex += ObjectGroupCubeSD3.CARDINAL_FACES.length;
            }
            var rightFace = ObjectGroupCubeSD3.CARDINAL_FACES[rightFaceIndex];
            this._rightRender = this._renders[rightFace];
            var rightAngle = maxYAngle - Math.PI * 3 / 4;
            this._rightTan = Math.tan(rightAngle);

            var topFace = ObjectGroupCubeSD3.FACE_TOP;
            this._topRender = this._renders[topFace];

        }

        public clone(): IObjectRenderSD3 {
            return new ObjectGroupCubeRenderSD3(this._depth);
        }

    }

} 