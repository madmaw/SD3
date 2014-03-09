module SD3 {

    export class ObjectVerticalSurfaceRenderSD3 extends AbstractObjectPhysicalRenderSD3 {

        private _sx: number;
        private _sy: number;
        private _sz: number;

        private _totalRotation: number;
        private _tanZ: number;

        constructor(private _maxY:number) {
            super();
        }

        public getScreenDepth(x: number, y: number): number {
            var sinX = this._camera.getRotationXSin();
            var cosX = this._camera.getRotationXCos();

            var sdx = x - this._sx;
            var sdy = y - this._sy;
            var dzatdx = sdx * this._tanZ;
            var sdyatdx = dzatdx * cosX;
            var dy = (sdy - sdyatdx) / sinX;
            //dy = Math.min(Math.max(0, dy), this._maxY);
            var invTanX = Math.tan(Math.PI / 2 - this._camera.getRotationX());
            var sdz = dy * invTanX - dzatdx * sinX;
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
            return new ObjectVerticalSurfaceRenderSD3(this._maxY);
        }
    }
}