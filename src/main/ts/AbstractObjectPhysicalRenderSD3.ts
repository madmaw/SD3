///<reference path="IObjectRenderSD3.ts"/>
///<reference path="IObjectSD3.ts"/>

module SD3 {

    export class AbstractObjectPhysicalRenderSD3 implements IObjectRenderSD3 {

        public static nextUniqueId: number = 1;

        public static getUniqueId(): string {
            var uniqueId = ''+AbstractObjectPhysicalRenderSD3.nextUniqueId;
            AbstractObjectPhysicalRenderSD3.nextUniqueId++;
            return uniqueId;
        }

        public _bounds: RectangleSD3;
        public _object: IObjectSD3;
        public _camera: CameraSD3;

        constructor(public id:string = AbstractObjectPhysicalRenderSD3.getUniqueId()) {
            this._bounds = new RectangleSD3();
        }

        public getBounds(): RectangleSD3 {
            return this._bounds;
        }

        public getScreenDepth(x: number, y: number): number {
            // override as appropriate
            return null;
        }

        /**
         * return true if it is in a renderable state
         */
        public reset(sx:number, sy:number, sz:number, zRotation:number): boolean {
            // do nothing! override!
            return false;
        }

        public isIn(x: number, y: number): boolean {
            return this._bounds.minX <= x && this._bounds.maxX >= x && this._bounds.minY <= y && this._bounds.maxY >= y;
        }


        public clone(): IObjectRenderSD3 {
            return null;
        }

    }

} 