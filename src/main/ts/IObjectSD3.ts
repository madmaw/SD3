module DD.SD3 {

    export interface IObjectSD3 {

        setView(view: IViewSD3): void;

        /**
         * returns false if there is actually nothing to render
         */
        getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean;

        /** 
         * returns a non-null value if the object is actually visible
         */
        render(sx: number, sy: number, sz: number, zRotation: number, forceReorder: boolean): IObjectRenderSD3;

        /** 
         * removes the object from the view, returns true if there was something to remove
         */
        unrender(): boolean;

        visible: boolean;

        clone(): IObjectSD3;

        addAnimation(animation: IAnimationSD3);

        removeAnimation(animation: IAnimationSD3);

        addChangeListener(changeListener: IObjectChangeListenerSD3);

        removeChangeListener(changeListener: IObjectChangeListenerSD3);

    }

} 