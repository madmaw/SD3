module SD3 {

    export class RectangleSD3 {

        public static intersect(r1: RectangleSD3, r2: RectangleSD3, into: RectangleSD3): RectangleSD3 {

            var r1minX = r1.minX;
            var r2minX = r2.minX;
            var r1minY = r1.minY;
            var r2minY = r2.minY;
            var r1maxX = r1.maxX;
            var r2maxX = r2.maxX;
            var r1maxY = r1.maxY;
            var r2maxY = r2.maxY;

            into.minX = Math.max(r1minX, r2minX);
            into.maxX = Math.min(r1maxX, r2maxX);
            into.minY = Math.max(r1minY, r2minY);
            into.maxY = Math.min(r1maxY, r2maxY);

            return into;
        }

        public static union(r1: RectangleSD3, r2: RectangleSD3, into: RectangleSD3): RectangleSD3 {

            var r1minX = r1.minX;
            var r2minX = r2.minX;
            var r1minY = r1.minY;
            var r2minY = r2.minY;
            var r1maxX = r1.maxX;
            var r2maxX = r2.maxX;
            var r1maxY = r1.maxY;
            var r2maxY = r2.maxY;

            into.minX = Math.min(r1minX, r2minX);
            into.maxX = Math.max(r1maxX, r2maxX);
            into.minY = Math.min(r1minY, r2minY);
            into.maxY = Math.max(r1maxY, r2maxY);

            return into;
        }

        constructor(
            public minX?: number,
            public minY?: number,
            public maxX?: number,
            public maxY?: number
        ) {

        }

        public get width(): number {
            return this.maxX - this.minX;
        }

        public get height(): number {
            return this.maxY - this.minY;
        }

        public get cx(): number {
            return (this.minX + this.maxX) / 2;
        }

        public get cy(): number {
            return (this.minY + this.maxY) / 2;
        }

        public overlaps(rect: RectangleSD3): boolean {
            return lineOverlaps(this.minX, this.maxX, rect.minX, rect.maxX) && lineOverlaps(this.minY, this.maxY, rect.minY, rect.maxY);
        }

        public contains(x: number, y: number): boolean {
            return this.minX <= x && this.maxX >= x && this.minY <= y && this.maxY >= y;
        }

        public scale(s: number) {
            this.minX *= s;
            this.maxX *= s;
            this.minY *= s;
            this.maxY *= s;
        }

        public union(rect: RectangleSD3, dx:number = 0, dy:number = 0): void {
            this.minX = nullMin(this.minX, rect.minX + dx);
            this.minY = nullMin(this.minY, rect.minY + dy);
            this.maxX = nullMax(this.maxX, rect.maxX + dx);
            this.maxY = nullMax(this.maxY, rect.maxY + dy);
        }

        public copy(rect: RectangleSD3, dx: number = 0, dy:number = 0): void {
            this.minX = rect.minX + dx;
            this.minY = rect.minY + dy;
            this.maxX = rect.maxX + dx;
            this.maxY = rect.maxY + dy;
        }
        
        
    }
} 