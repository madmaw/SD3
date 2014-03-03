module SD3 {

    export class CompositeObjectRenderSD3 implements IObjectRenderSD3 {

        public _renders: { [_: string]: IObjectRenderSD3 };
        private _renderCount: number;
        private _bounds: RectangleSD3;
        private _minimalDepth: number;
        public _sx: number;
        public _sy: number;
        public _sz: number;
        public _object: IObjectSD3;
        public _camera: CameraSD3;

        constructor() {
            this._bounds = new RectangleSD3();
        }

        public reset(sx: number, sy: number, sz: number, zRotation: number) {
            this._sx = sx;
            this._sy = sy;
            this._sz = sz;
            this._renders = {};
            this._renderCount = 0;
        }

        public onLoaded() {
            // do nothing
        }

        public add(key: string, render: IObjectRenderSD3, calculateBounds:boolean) {
            if( calculateBounds ) {
                var renderBounds = render.getBounds();
                if (this._renderCount == 0) {
                    this._bounds.copy(renderBounds, this._sx, this._sy);
                } else {
                    this._bounds.union(renderBounds, this._sx, this._sy);
                }
            }
            this._renderCount++;
            this._renders[key] = render;
        }

        public getBounds(): RectangleSD3 {
            return this._bounds;
        }

        public get empty(): boolean {
            return this._renderCount == 0;
        }

        public getScreenDepth(x: number, y: number): number {
            var minimumScreenDepth = null;
            for (var i in this._renders) {
                var render = this._renders[i];
                var screenDepth = this.getScreenDepthForRender(render, x, y);
                if (screenDepth != null) {
                    if (minimumScreenDepth == null || minimumScreenDepth > screenDepth) {
                        minimumScreenDepth = screenDepth;
                    }
                }
            }
            return minimumScreenDepth;
        }

        public getScreenDepthForRender(render: IObjectRenderSD3, x: number, y: number): number {
            var result = render.getScreenDepth(x - this._sx, y - this._sy);
            if (result != null) {
                result += this._sz;
            }
            return result;
        }

        public isIn(x: number, y: number): boolean {
            var isIn = false;
            for( var i in this._renders) {
                var render = this._renders[i];
                isIn = render.isIn(x - this._sx, y - this._sy);
                if (isIn) {
                    break;
                }
            }
            return isIn;
        }

        public clone(): IObjectRenderSD3 {
            return new CompositeObjectRenderSD3();
        }

    }

} 