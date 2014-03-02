module DD.SD3 {

    export class CameraSD3 {

        private _rotationX: number;
        private _rotationXSin: number;
        private _rotationXCos: number;
        private _rotationXTan: number;
        private _rotationZ: number;

        getRotationX(): number {
            return this._rotationX;
        }

        setRotationX(rotationX: number): void {
            this._rotationX = rotationX;
            this._rotationXSin = Math.sin(rotationX);
            this._rotationXCos = Math.cos(rotationX);
            this._rotationXTan = Math.tan(rotationX);
        }

        getRotationXSin(): number {
            return this._rotationXSin;
        }

        getRotationXCos(): number {
            return this._rotationXCos;
        }

        getRotationXTan(): number {
            return this._rotationXTan;
        }

        getRotationZ(): number {
            return this._rotationZ;
        }

        setRotationZ(rotationZ: number): void {
            this._rotationZ = rotationZ;
        }



    }

}