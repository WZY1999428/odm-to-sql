import type { Logical } from "./logical"
import type { QueryOperators } from "./conditional"
import type { UpdateAtomic } from "./updateAtomic"
import type {
    AggregateOps, PipelineStages, AggregationOptions, AggregateOption
    , AggregateFields, OneOrMany ,
} from "./aggregate"
export { LogicalMap } from "./logical"
export { QueryOperatorMap } from "./conditional"
export { UpdateAtomicMap } from "./updateAtomic"


export type Query<T> = {
    // 关键点：[P in keyof T & string]
    [P in keyof T & string]?: T[P] | Condition<T[P]>;
} & {
    [K in Logical]?: K extends '$not' ? Query<T> : Query<T>[];
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
} & {
    [P in keyof T & string]?: T[P] | UpdateAtomic;
}

// 针对单个字段的操作符提示
type Condition<V> = QueryOperators<V> & {
    $between?: [V, V]; // 特殊处理 $between
    $in?: V[];         // 特殊处理 $in
    $nin?: V[];        // 特殊处理 $nin
    $exists?: boolean;
    $like?: string;
    $nlike?: string;
};


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