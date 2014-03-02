 module SD3 {

     export interface IObjectRenderSD3 {

         getBounds(): RectangleSD3;

         getScreenDepth(x: number, y: number): number;

         isIn(x: number, y: number): boolean;

         clone(): IObjectRenderSD3;

    }

 }