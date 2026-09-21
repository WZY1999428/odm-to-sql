import type { JsonArrayAgg, JsonArrayAggFields } from "./operators/aggregate.js";
export default function parseJsonArrayAgg<T>(jsonArrayAgg: JsonArrayAgg<T>[]): {
    sql: string;
    params: any[];
};
export declare function joinJsonObject(fields: JsonArrayAggFields): string;
//# sourceMappingURL=parseJsonArrayAgg.d.ts.map