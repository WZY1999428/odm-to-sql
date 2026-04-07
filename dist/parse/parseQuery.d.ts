import type { Query } from "./operators/index";
export default function parseQuery<T>(query: Query<T>): {
    sql: string;
    params: any[];
};
//# sourceMappingURL=parseQuery.d.ts.map