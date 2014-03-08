///<reference path="AbstractObjectPhysicalSD3.ts"/>

module SD3 {

    export class ObjectHorizontalSurfaceSD3 extends AbstractObjectPhysicalSD3 {

        private _maxDiagonalDiv2:number;

        constructor(
            element: Element,
            camera: CameraSD3,
            private _width: number,
            private _height: number,
            render: AbstractObjectPhysicalRenderSD3 = new ObjectHorizontalSurfaceRenderSD3()
        ) {
            super(
                element,
                camera, [
                    new PointSD3(-_width / 2, -_height / 2, 0), 
                    new PointSD3(_width / 2, -_height / 2, 0),
                    new PointSD3(_width / 2, _height / 2, 0),
                    new PointSD3(-_width / 2, _height / 2, 0)
                ],
                render
            );
            // calculate the maximal bounds
            // assumes the object is actually centered at the specified screen position
            var max = Math.max(this._width, this._height);
            this._maxDiagonalDiv2 = Math.sqrt(max * max + max * max) / 2;
        }

        public getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            var a0 = zRotation + Math.PI / 4;
            var a90 = zRotation - Math.PI / 4;
            var sinZ = Math.max( Math.abs(Math.sin(a0)), Math.abs(Math.sin(a90)) );
            var cosZ = Math.max( Math.abs(Math.cos(a0)), Math.abs(Math.cos(a90)) );

            var dx = cosZ * this._maxDiagonalDiv2;
            var dy = sinZ * this._maxDiagonalDiv2;

            var cosX = this._camera.getRotationXCos();
            into.minX = sx - dx;
            into.maxX = sx + dx;
            into.minY = sy - dy * cosX;
            into.maxY = sy + dy * cosX;
            /*
            into.minX = sx - this._maxDiagonalDiv2;
            into.maxX = sx + this._maxDiagonalDiv2;
            into.minY = sy - this._maxDiagonalDiv2 * cosX;
            into.maxY = sy + this._maxDiagonalDiv2 * cosX;
            */
            return true;
        }

        public getTransform(sx: number, sy: number, sz: number, zRotation: number): string {
            var cosX = this._camera.getRotationXCos();
            //return "translate("+sx.toFixed(PRECISION)+", "+sy.toFixed(PRECISION)+") scale(1, "+cosX.toFixed(PRECISION)+") rotate("+rad2deg(zRotation % (Math.PI * 2)).toFixed(PRECISION)+")";
            return "matrix(1, 0, 0, "+cosX.toFixed(PRECISION)+", " + sx.toFixed(PRECISION) + ", " + sy.toFixed(PRECISION) + ") rotate(" + rad2deg(zRotation % (Math.PI * 2)).toFixed(PRECISION) +")"
            //return "matrix(1, 0, 0, 0.9014, 0.0000, 0.0000) rotate(333.8376)";
        }


        public clone(): IObjectSD3 {
            return new ObjectHorizontalSurfaceSD3(
                <Element>this._element.cloneNode(true),
                this._camera,
                this._width,
                this._height,
                <AbstractObjectPhysicalRenderSD3>this._render.clone()
            );
        }
    }

} 