module SD3 {

    export class ObjectSphereRenderSD3 extends AbstractObjectPhysicalRenderSD3 {

        private _sz: number;

        constructor() {
            super();
        }

        public getScreenDepth(x: number, y: number): number {

            return this._sz;
        }

        public reset(sx: number, sy: number, sz: number, zRotation: number): boolean {
            this._sz = sz;
            return true;
        }

        public clone(): IObjectRenderSD3 {
            return new ObjectSphereRenderSD3();
        }
    }
}