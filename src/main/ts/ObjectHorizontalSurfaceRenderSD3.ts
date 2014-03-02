module DD.SD3 {

    export class ObjectHorizontalSurfaceRenderSD3 extends AbstractObjectPhysicalRenderSD3 {

        private _sy: number;
        private _sz: number;

        constructor() {
            super();
        }

        public getScreenDepth(x: number, y: number): number {
            var tanX = this._camera.getRotationXTan();
            var dsy = y - this._sy;
            //var dy = dsy / cosX;
            var dsz = dsy * tanX;
            // minus it because....?
            return this._sz - dsz;

        }

        public reset(sx: number, sy: number, sz: number, zRotation: number): boolean {
            this._sy = sy;
            this._sz = sz;
            return true;
        }

        public clone(): IObjectRenderSD3 {
            return new ObjectHorizontalSurfaceRenderSD3();
        }
    }

} 