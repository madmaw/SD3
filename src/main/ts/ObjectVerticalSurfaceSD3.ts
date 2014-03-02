///<reference path="AbstractObjectPhysicalSD3.ts"/>

module DD.SD3 {

    export class ObjectVerticalSurfaceSD3 extends AbstractObjectPhysicalSD3 {

        constructor(
            element: Element,
            camera: CameraSD3,
            public zRotation: number,
            private _width: number,
            private _depth: number,
            public _twoSided?: boolean,
            render: AbstractObjectPhysicalRenderSD3 = new ObjectVerticalSurfaceRenderSD3()
        ) {
            super(element, camera, [
                new PointSD3(0, 0, 0), 
                new PointSD3(0, 0, _depth),
                new PointSD3(Math.cos(zRotation - Math.PI / 2) * _width, Math.sin(zRotation - Math.PI / 2) * _width, 0),
                new PointSD3(Math.cos(zRotation - Math.PI / 2) * _width, Math.sin(zRotation - Math.PI / 2) * _width, _depth),
            ], render);
        }

        public getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            var totalZRotation = zRotation + this.zRotation;
            var sinZ = Math.sin(totalZRotation);
            // facing away, don't bother rendering
            var result = this._twoSided || sinZ > ALMOST_ZERO;
            if (result) {
                var cosZ = Math.cos(totalZRotation);
                var sinX = this._camera.getRotationXSin();
                var cosX = this._camera.getRotationXCos();
                // do bounds checking, no need to render offscreen surfaces
                var x1 = sx;
                var x2 = sx + sinZ * this._width;
                into.minX = Math.min(x1, x2);
                into.maxX = Math.max(x1, x2);

                var dy = cosX * cosZ * this._width;
                into.minY = sy - Math.max(0, dy);
                into.maxY = sy + sinX * this._depth - Math.min(0, dy);
            }
            return result;
        }

        public getTransform(sx: number, sy: number, sz: number, zRotation: number): string {
            var totalZRotation = zRotation + this.zRotation;
            var sinX = this._camera.getRotationXSin();
            var cosX = this._camera.getRotationXCos();
            var sinZ = Math.sin(totalZRotation);
            var cosZ = Math.cos(totalZRotation);
            //return "translate(" + sx + ", " + sy + ") matrix(" + sinZ + "," + -cosZ * cosX + ", 0, 1, 0, 0) scale(1, " + sinX + ")";
            return "matrix(" + sinZ.toFixed(PRECISION) + ", " + (-cosZ * cosX).toFixed(PRECISION) + ", 0, " + sinX.toFixed(PRECISION) + ", " + sx.toFixed(PRECISION) + ", " + sy.toFixed(PRECISION) + ")";
            //return "matrix(0.9927, 0.0200, 0, 0.9862, -55.6616, 7.2247)";
        }

        public clone(): IObjectSD3 {
            return new ObjectVerticalSurfaceSD3(
                <Element>this._element.cloneNode(true),
                this._camera, this.zRotation,
                this._width,
                this._depth,
                this._twoSided, 
                <AbstractObjectPhysicalRenderSD3>this._render.clone()
            );
        }

    }

} 