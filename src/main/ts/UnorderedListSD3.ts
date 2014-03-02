module DD.SD3 {

    export class UnorderedListSD3<T> implements IListSD3<T> {

        public _elements: T[];

        constructor() {
            this._elements = [];
        }

        public get length(): number {
            return this._elements.length;
        }

        public foreach(f: (o: T) => boolean): boolean {
            for (var i in this._elements) {
                var e = this._elements[i];
                if (!f(e)) {
                    return true;
                }
            }
            return false;
        }

        insert(t: T): T {
            this._elements.push(t);
            return null;
        }

        remove(f: (o: T) => ListRemoveResultSD3) {
            outer: for (var i = this._elements.length; i > 0;) {
                i--;
                var e = this._elements[i];
                var result = f(e);
                switch (result) {
                    case ListRemoveResultSD3.DELETE_BREAK:
                    case ListRemoveResultSD3.DELETE_CONTINUE:
                        this._elements.splice(i, 1);
                        break;
                }
                switch(result) {
                    case ListRemoveResultSD3.DELETE_BREAK:
                    case ListRemoveResultSD3.BREAK:
                        break outer;
                }
            }
        }

        public empty(): IListSD3<T> {
            return new UnorderedListSD3<T>();
        }


    }

} 