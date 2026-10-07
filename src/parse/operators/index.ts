import type { Logical } from "./logical.js"
import type { QueryOperators } from "./conditional.js"
import type { UpdateAtomic } from "./updateAtomic.js"
import type {
    AggregateOps, PipelineStages, AggregationOptions, AggregateOption
    , AggregateFields, OneOrMany,
} from "./aggregate.js"
export { LogicalMap } from "./logical.js"
export { QueryOperatorMap } from "./conditional.js"
export { UpdateAtomicMap } from "./updateAtomic.js"

export type Fields = (string | Record<string, Select>)[];


type QueryFields<T> = {
    [P in keyof T & string]?: T[P] | Condition<T[P]>;
};

type QueryLogical<T> = {
    [K in Logical]?: K extends '$not'
    ? Query<T>
    : Query<T>[];
};

type QuerySpecial<T> = {
    $select?: Select<T>;
};

export type Query<T = any> =
    QueryFields<T>
    & QueryLogical<T>
    & QuerySpecial<any>
    & Record<string, any>;
export type SelectType = "raw" | "jsonObject" | "jsonArray" | "count";

export type Select<T = any> = {
    table: string;
    type?: SelectType;
    fields?: Extract<keyof T, string>[];
    query?: Query<T>;
    limit?: number;
    offset?: number;
};
// 针对单个字段的操作符提示
type Condition<V> = QueryOperators<V> & {
    $between?: [V, V]; // 特殊处理 $between
    $in?: V[];         // 特殊处理 $in
    $nin?: V[];        // 特殊处理 $nin
    $exists?: boolean;
    $like?: string;
    $nlike?: string;
};

type ArithmeticOperator<T> = Partial<Record<keyof T, number>>;
export type Update<T> = {
    $set?: Partial<T>;
    $inc?: ArithmeticOperator<T>;
    $mul?: ArithmeticOperator<T>;
    dec?: ArithmeticOperator<T>;
    div?: ArithmeticOperator<T>;
    $max?: Partial<T>;
    $min?: Partial<T>;
    $concat?: Partial<Record<keyof T, string>>;
    $col?: Partial<Record<keyof T, string>>;
    $json?: string;
} & {
    [P in keyof T & string]?: T[P] | UpdateAtomic;
}


export type mathType = 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'COUNT';

export type {
    Logical,
    QueryOperators,
    AggregateOps,
    PipelineStages,
    AggregateOption,
    AggregateFields,
    AggregationOptions,
    OneOrMany
};