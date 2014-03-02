// Type definitions for Hammer.js 1.0.5
// Project: http://eightmedia.github.com/hammer.js/
// Definitions by: Boris Yankov <https://github.com/borisyankov/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


// Gesture Options : https://github.com/EightMedia/hammer.js/wiki/Getting-Started#gesture-options
interface HammerOptions {
    drag?: boolean;
    drag_block_horizontal?: boolean;
    drag_block_vertical?: boolean;
    drag_lock_to_axis?: boolean;
    drag_max_touches?: number;
    drag_min_distance?: number;
    hold?: boolean;
    hold_threshold?: number;
    hold_timeout?: number;
    prevent_default?: boolean;
    prevent_mouseevents?: boolean;
    release?: boolean;
    show_touches?: boolean;
    stop_browser_behavior?: any;
    swipe?: boolean;
    swipe_max_touches?: number;
    swipe_velocity?: number;
    tap?: boolean;
    tap_always?: boolean;
    tap_max_distance?: number;
    tap_max_touchtime?: number;
    doubletap_distance?: number;
    doubletap_interval?: number;
    touch?: boolean;
    transform?: boolean;
    transform_always_block?: boolean;
    transform_min_rotation?: number;
    transform_min_scale?: number;
}

interface HammerPoint {
    x: number;
    y: number;
}

interface HammerEvent {
    gesture: HammerGesture;
}

interface HammerGesture {
    deltaX: number;
    deltaY: number;
    rotation: number;
    scale: number;
    angle: number;
    distance: number;
    center: {
        pageX: number;
        pageY: number;
    };
}

declare class Hammer {
    constructor (element: any, options?: HammerOptions);

    on(eventName: string, eventHandler:(event: HammerEvent)=>void): void;

    off(eventName: string, eventHandler: (event: HammerEvent) => void): void;
    
}

