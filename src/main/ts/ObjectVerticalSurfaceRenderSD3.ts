module DD.SD3 {

    export class ObjectVerticalSurfaceRenderSD3 extends AbstractObjectPhysicalRenderSD3 {

        private _sx: number;
        private _sy: number;
        private _sz: number;

        private _totalRotation: number;
        private _tanZ: number;

        constructor() {
            super();
        }

        public getScreenDepth(x: number, y: number): number {
            var sinX = this._camera.getRotationXSin();
            var cosX = this._camera.getRotationXCos();

            var sdx = x - this._sx;
            var sdy = y - this._sy;
            var yatdx = sdx * this._tanZ;
            var dy = sdy / cosX - yatdx;
            var sdz = -yatdx * sinX + dy * cosX;
            return this._sz + sdz;
        }

        public reset(sx: number, sy: number, sz: number, zRotation: number): boolean {
            var tanX = this._camera.getRotationXTan();
            var facing = !isAlmostZero(tanX);
            if (facing) {
                var verticalSurface = <ObjectVerticalSurfaceSD3>this._object;
                var totalZRotation = zRotation + verticalSurface.zRotation;
                var sinZ = Math.sin(totalZRotation);
                facing = (sinZ > ALMOST_ZERO || verticalSurface._twoSided);
                if (facing) {
                    this._sx = sx;
                    this._sy = sy;
                    this._sz = sz;
                    this._tanZ = Math.tan(totalZRotation + Math.PI / 2);
                }
            }
            return facing;
        }

        public clone(): IObjectRenderSD3 {
            return new ObjectVerticalSurfaceRenderSD3();
        }
    }
}