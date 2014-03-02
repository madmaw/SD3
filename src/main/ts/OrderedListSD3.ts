///<reference path="UnorderedListSD3.ts"/>

module DD.SD3 {
    export class OrderedListSD3<T> extends UnorderedListSD3<T> {

        constructor(private _compare?: (t1: T, t2: T) => number) {
            super();
        }

        public insert(t: T): T {
            var index = search(this._elements, t, (t1: T, t2: T) => {
                return this._compare(t1, t2) < 0;
            });
            var result = this._elements[index];
            this._elements.splice(index, 0, t);
            return result;
        }

        public empty(): IListSD3<T> {
            return new OrderedListSD3(this._compare);
        }

    }

} 