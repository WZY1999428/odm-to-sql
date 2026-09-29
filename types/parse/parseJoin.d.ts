import type { Join } from "./operators/aggregate.js";
declare function parseJoin(joins: Join[]): {
    joinSql: string;
    select: string;
    params: any[];
};
export default parseJoin;
//# sourceMappingURL=parseJoin.d.ts.map