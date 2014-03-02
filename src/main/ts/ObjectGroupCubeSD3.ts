///<reference path="ObjectGroupPhysicalSD3.ts"/>

module SD3 {
    export class ObjectGroupCubeSD3 extends ObjectGroupPhysicalSD3 {

        public static FACE_NORTH: string    = "north";
        public static FACE_SOUTH: string    = "south";
        public static FACE_EAST: string     = "east";
        public static FACE_WEST: string     = "west";
        public static FACE_TOP: string      = "top";

        public static CARDINAL_FACES = [ObjectGroupCubeSD3.FACE_EAST, ObjectGroupCubeSD3.FACE_SOUTH, ObjectGroupCubeSD3.FACE_WEST, ObjectGroupCubeSD3.FACE_NORTH];

        public static create(
            camera: CameraSD3,
            physicalView: IViewSD3,
            width: number,
            height: number,
            depth: number,
            topSurface?: Element,
            eastSurface?: Element,
            northSurface?: Element,
            westSurface?: Element,
            southSurface?: Element
        ): ObjectGroupCubeSD3 {
            // build
            var result = new ObjectGroupCubeSD3(camera, physicalView, width, height, depth);
            ObjectGroupCubeSD3.attachSurfaces(result, topSurface, eastSurface, northSurface, westSurface, southSurface);
            return result;
        }

        public static attachSurfaces(
            into: ObjectGroupCubeSD3,
            topSurface?: Element,
            eastSurface?: Element,
            northSurface?: Element,
            westSurface?: Element,
            southSurface?: Element
        ) {
            if (topSurface) {
                var topObject = new ObjectHorizontalSurfaceSD3(topSurface, into._camera, into._width, into._height);
                into.setTopObject(topObject);
            }
            if (eastSurface) {
                var eastObject = new ObjectVerticalSurfaceSD3(eastSurface, into._camera, 0, into._height, into._depth, false);
                into.setEastObject(eastObject);
            }
            if (westSurface) {
                var westObject = new ObjectVerticalSurfaceSD3(westSurface, into._camera, Math.PI, into._height, into._depth, false);
                into.setWestObject(westObject);
            }
            if (northSurface) {
                var northObject = new ObjectVerticalSurfaceSD3(northSurface, into._camera, Math.PI * 3 / 2, into._width, into._depth, false);
                into.setNorthObject(northObject);
            }
            if (southSurface) {
                var southObject = new ObjectVerticalSurfaceSD3(southSurface, into._camera, Math.PI / 2, into._width, into._depth, false);
                into.setSouthObject(southObject);
            }
        }

        private _topObject: IObjectSD3;
        private _eastObject: IObjectSD3; 
        private _northObject: IObjectSD3; 
        private _westObject: IObjectSD3;
        private _southObject: IObjectSD3;

        constructor(
            camera: CameraSD3,
            physicalView: IViewSD3,
            public _width: number,
            public _height: number,
            public _depth: number,
            topObject?: IObjectSD3,
            eastObject?: IObjectSD3, 
            northObject?: IObjectSD3, 
            westObject?: IObjectSD3, 
            southObject?: IObjectSD3, 
            render: CompositeObjectRenderSD3 = new CompositeObjectRenderSD3()
        ) {
            super(camera, physicalView, render);
            this.setTopObject(topObject);
            this.setEastObject(eastObject);
            this.setNorthObject(northObject);
            this.setWestObject(westObject);
            this.setSouthObject(southObject);
        }

        public setTopObject(topObject: IObjectSD3) {
            this._topObject = topObject;
            this.carefulSetObject(ObjectGroupCubeSD3.FACE_TOP, this._topObject, new PointSD3(0, 0, 0), 0);
        }

        public setEastObject(eastObject: IObjectSD3) {
            this._eastObject = eastObject;
            this.carefulSetObject(ObjectGroupCubeSD3.FACE_EAST, this._eastObject, new PointSD3(this._width / 2, this._height / 2, 0), 0);
        }

        public setSouthObject(southObject: IObjectSD3) {
            this._southObject = southObject;
            this.carefulSetObject(ObjectGroupCubeSD3.FACE_SOUTH, this._southObject, new PointSD3(-this._height / 2, this._width / 2, 0), 0);
        }

        public setWestObject(westObject: IObjectSD3) {
            this._westObject = westObject;
            this.carefulSetObject(ObjectGroupCubeSD3.FACE_WEST, this._westObject, new PointSD3(-this._width / 2, -this._height / 2, 0), 0);
        }

        public setNorthObject(northObject: IObjectSD3) {
            this._northObject = northObject;
            this.carefulSetObject(ObjectGroupCubeSD3.FACE_NORTH, this._northObject, new PointSD3(this._width / 2, -this._height / 2, 0), 0);
        }

        private carefulSetObject(id: string, object: IObjectSD3, position: PointSD3, zRotation: number) {
            if (object != null) {
                this.setObject(id, object, position, zRotation, false, true);
            } else {
                this.removeObject(id);
            }
        }

        public getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            // basic bounds
            var topObject = <AbstractObjectPhysicalSD3>this._topObject;
            var result = topObject.getBounds(into, sx, sy, zRotation);
            // add in the depth 
            into.maxY += this._camera.getRotationXSin() * this._depth;
            return result;
        }

        public clone(): IObjectSD3 {
            return new ObjectGroupCubeSD3(
                this._camera,
                this._physicalView.clone(),
                this._width,
                this._height,
                this._depth,
                this._topObject.clone(),
                this._eastObject.clone(),
                this._northObject.clone(),
                this._westObject.clone(),
                this._southObject.clone(),
                <CompositeObjectRenderSD3>this._render.clone()
            );
        }
    }

}