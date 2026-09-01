import { AggregationOptions, AggregateOption } from "./operators/index.js";
export default function parseAggregate<T>(table: string, options: AggregationOptions<T>): {
    sql: string;
    params: any;
};
export declare function isAggregateOption<T>(value: any): value is AggregateOption<T>;
//# sourceMappingURL=parseAggregate.d.ts.map