import type { Query } from "./operators/index.js";
export default function parseQuery<T>(query: Query<T>): {
    sql: string;
    params: any[];
};
//# sourceMappingURL=parseQuery.d.ts.map