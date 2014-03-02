module DD.SD3 {

    export class PointSD3 {
        constructor(public x?: number, public y?: number, public z?: number) {
        }

        public clone(): PointSD3 {
            return new PointSD3(this.x, this.y, this.z);
        }
        
    }

} 