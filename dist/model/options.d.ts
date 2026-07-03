import type { OrderBy } from "../parse/parseOrder";
export type { AggregationOptions } from "../parse/operators";
export type FindOneOptions<T> = {
    fields?: string[];
    sort?: OrderBy<T>;
};
export type FindOptions<T> = FindOneOptions<T> & {
    /** 分页 */
    limit?: number;
    /** 偏移 */
    offset?: number;
};
export type InsertOptions = {
    /** 忽略冲突 (INSERT IGNORE) */
    ignore?: boolean;
    /** 如果存在冲突，则更新这些字段。如果是 true，则更新所有传入字段。 */
    upsert?: boolean | string[];
};
export type insertManyOptions = {
    useTransaction?: boolean;
    batchSize?: number;
} & InsertOptions;
export type UpdateOptions = {
    upsert?: boolean;
};
//# sourceMappingURL=options.d.ts.map