module DD.SD3 {

    export interface IObjectPhysicalSD3 extends IObjectSD3 {
        getElement(): Element;

        find(pathSpec: string, includeHidden?: boolean): NodeList;
    }

} 