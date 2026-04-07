import type { Logical } from "./logical";
import type { QueryOperators } from "./conditional";
import type { UpdateAtomic } from "./updateAtomic";
import type { AggregateOps, PipelineStages, AggregationOptions, AggregateOption, AggregateFields, OneOrMany } from "./aggregate";
export { LogicalMap } from "./logical";
export { QueryOperatorMap } from "./conditional";
export { UpdateAtomicMap } from "./updateAtomic";
export type Query<T> = {
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
};
type Condition<V> = QueryOperators<V> & {
    $between?: [V, V];
    $in?: V[];
    $nin?: V[];
    $exists?: boolean;
    $like?: string;
    $nlike?: string;
};
export type { Logical, QueryOperators, AggregateOps, PipelineStages, AggregateOption, AggregateFields, AggregationOptions, OneOrMany };
//# sourceMappingURL=index.d.ts.map