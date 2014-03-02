///<reference path="IObjectSD3.ts"/>

module DD.SD3 {

    export class AbstractObjectSD3 implements IObjectSD3 {

        // assume we are only every shown in one view
        private _visible: boolean;
        public _view: IViewSD3;
        private _animations: IAnimationSD3[];
        private _changeListeners: IObjectChangeListenerSD3[];

        constructor(public _camera:CameraSD3) {
            this._visible = false;
            this._changeListeners = [];
        }

        public get visible() {
            return this._visible;
        }

        public set visible(visible: boolean) {
            if (this._visible != visible) {
                this._visible = visible;
                // notify any animations that we have changed visibility
                for (var i in this._animations) {
                    var animation = this._animations[i];
                    animation.onVisibilityChanged(this, visible);
                }
            }

        }

        public setView(view: IViewSD3) {
            this._view = view;
        }

        getBounds(into: RectangleSD3, sx: number, sy: number, zRotation: number): boolean {
            return false;
        }


        public render(sx: number, sy: number, sz: number, zRotation: number, forceReorder: boolean): IObjectRenderSD3 {
            return null;
        }

        public unrender(): boolean {
            return false;
        }

        public clone(): IObjectSD3 {
            return null;
        }


        public addAnimation(animation: IAnimationSD3) {
            this._animations.push(animation);
        }

        public removeAnimation(animation: IAnimationSD3) {
            removeFromArray(animation, this._animations);
        }

        public addChangeListener(changeListener: IObjectChangeListenerSD3) {
            this._changeListeners.push(changeListener);
        }

        public removeChangeListener(changeListener: IObjectChangeListenerSD3) {
            removeFromArray(changeListener, this._changeListeners);
        }

        public _fireChangeEvent() {
            for (var i in this._changeListeners) {
                var changeListener = this._changeListeners[i];
                changeListener(this);
            }
        }

    }

} 