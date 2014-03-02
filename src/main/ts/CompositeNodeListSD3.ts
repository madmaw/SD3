module DD.SD3 {
    export class CompositeNodeListSD3 implements NodeList {
        private _length: number;

        constructor(private _nodeLists: NodeList[]) {
            this._length = 0;
            for (var i = 0; i < _nodeLists.length; i++) {
                var nodeList = this._nodeLists[i];
                this._length += nodeList.length;
            }
        }

        public get length(): number {
            return this._length;
        }

        public item(index: number): Node {
            var nodeList: NodeList = this._nodeLists[0];
            var i = 0;
            while (nodeList.length <= index) {
                i++;
                index -= nodeList.length;
                nodeList = this._nodeLists[i];
            }
            return nodeList.item(index);
        }

        //?
        [index: number]: Node;

    }
}