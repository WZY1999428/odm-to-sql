import { Query } from "./index";
import { OrderBy } from "../parseOrder";
declare const AggregateFunctionsMap: {
    readonly $min: "MIN";
    readonly $max: "MAX";
    readonly $sum: "SUM";
    readonly $avg: "AVG";
    readonly $count: "COUNT";
};
export type AggregateOps = keyof typeof AggregateFunctionsMap;
declare const PipelineStagesMap: {
    readonly $group: "GROUP BY";
    readonly $having: "HAVING";
};
export type PipelineStages = keyof typeof PipelineStagesMap;
export type AggregateOption<T> = {
    field: T;
    as?: string;
    from?: string;
    where?: Query<unknown>;
};
export type OneOrMany<T> = T | T[];
export type AggregateFields<T> = {
    [key in AggregateOps]?: OneOrMany<AggregateOption<T> | keyof T>;
} & {
    $count?: OneOrMany<Partial<{
        field: keyof T | '*';
        as: string;
        from: string;
        where: Query<unknown>;
    }> | keyof T | '*'>;
};
type ColumnFields<T> = keyof T | string;
/** inner 内连接  left 左连接  right 右连接  full 全连接 self 自连接 */
type JoinType = 'inner' | 'left' | 'right' | 'full' | 'self';
export declare const JoinTypeMap: {
    inner: string;
    left: string;
    right: string;
    full: string;
    self: string;
};
interface NormalJoin {
    table: string;
    on: Record<string, string>;
    type?: JoinType;
    as?: string;
}
interface SelfJoin {
    table: string;
    on?: Record<string, string>;
    type: 'self';
    as: string;
}
type Join = NormalJoin | SelfJoin;
export type AggregationOptions<T> = {
    fields: ColumnFields<T>[];
    specs?: AggregateFields<T>;
    query?: Query<T>;
    group?: (keyof T)[];
    having?: Query<T>;
    sort?: OrderBy<T>;
    joins?: Join[];
    limit?: number;
    offset?: number;
};
export {};
//# sourceMappingURL=aggregate.d.ts.map