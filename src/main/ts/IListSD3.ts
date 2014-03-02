module SD3 {

    export enum ListRemoveResultSD3 {
        CONTINUE = 0,
        BREAK = 1,
        DELETE_CONTINUE = 2,
        DELETE_BREAK = 3
    }

    export interface IListSD3<T> {
        length: number;

        foreach(f: (o: T) => boolean): boolean;

        insert(t: T): T;

        remove(f: (o: T) => ListRemoveResultSD3);

        empty(): IListSD3<T>;

    }
}