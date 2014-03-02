module SD3 {

    export var VISUAL_DEBUG:IVisualDebugSD3;

    export function nullMax(a: number, b: number): number {
        var result;
        if (a == null) {
            result = b;
        } else if (b == null) {
            result = a;
        } else {
            result = Math.max(a, b);
        }
        return result;
    }

    export function nullMin(a: number, b: number): number {
        var result;
        if (a == null) {
            result = b;
        } else if (b == null) {
            result = a;
        } else {
            result = Math.min(a, b);
        }
        return result;
    }

    export function rad2deg(rad: number) {
        return (rad * 180) / Math.PI;
    }

    export function lineOverlaps(min1: number, max1: number, min2: number, max2: number): boolean {
        return max1 >= min2 && max2 >= min1;
    }

    export function enableBoundsDebug(outputNode: Node, debugRectPrototype: SVGRectElement) {
        DEBUG_OUTPUT_NODE = outputNode;
        DEBUG_RECT_PROTOTYPE = debugRectPrototype;
    }

    export function isAlmostZero(z: number) {
        return z > -ALMOST_ZERO && z < ALMOST_ZERO;
    }

    export function search<A, T>(a: A[], t: T, isLessThan?: (a1: A, t2: T) => boolean): number {
        if (isLessThan == null) {
            isLessThan = function (a1: A, t2: T): boolean {
                return <any>a1 < <any>t2;
            };
        }
        var min = 0;
        var max = a.length - 1;
        while (min <= max) {
            var mid = Math.floor((min + max) / 2);
            var omid = a[mid];
            if (isLessThan(omid, t)) {
                min = mid + 1;
            } else {
                max = mid - 1;
            }
        }
        return min;
    }

    export function removeFromArray<T>(e: T, a: T[], eqf?: (e1: T, e2: T) => boolean): boolean {
        if (eqf == null) {
            eqf = function (e1: T, e2: T) {
                return e1 == e2;
            };
        }
        for (var i in a) {
            var o = a[i];
            if (eqf(o, e)) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    export var ALMOST_ZERO = 0.001;
    export var PRECISION = 4;
    export var DEBUG_OUTPUT_NODE:Node = null;
    export var DEBUG_RECT_PROTOTYPE:SVGRectElement = null;
} 