module DD.SD3 {

    export interface ISubObjectSD3 {
        offset: PointSD3;
        zRotation: number;
        object: IObjectSD3;
        hidden: boolean;
        boundsChangeListener: IObjectChangeListenerSD3;
    }


} 