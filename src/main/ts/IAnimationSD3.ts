module DD.SD3 {

    export interface IAnimationSD3 {

        onVisibilityChanged(object:IObjectSD3, visible: boolean);

        addCompletionListener(completionListener:()=>void);
    }

} 