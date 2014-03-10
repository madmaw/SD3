 module SD3 {

     export interface IObjectRenderSD3 {

         id: string;

         getBounds(): RectangleSD3;

         getScreenDepth(x: number, y: number): number;

         isIn(x: number, y: number): boolean;

         clone(): IObjectRenderSD3;

    }

 }