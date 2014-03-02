///<reference path="AbstractObjectPhysicalSD3.ts"/>

module SD3 {

    export class ObjectSphereSD3 extends AbstractObjectPhysicalSD3 {

        constructor(element: Element, camera: CameraSD3, private _diameter: number, render: AbstractObjectPhysicalRenderSD3 = new ObjectSphereRenderSD3()) {
            super(element, camera, null, render);
        }

        public getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            into.minX = sx - this._diameter / 2;
            into.maxX = into.minX + this._diameter;
            into.minY = sy - this._diameter / 2;
            into.maxY = into.minY + this._diameter;
            return true;
        }

        public clone(): IObjectSD3 {
            return new ObjectSphereSD3(
                <Element>this._element.cloneNode(true),
                this._camera,
                this._diameter,
                <AbstractObjectPhysicalRenderSD3>this._render.clone()
            );
        }

    }
} 