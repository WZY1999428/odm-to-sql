import type { Case } from "./operators/case.js";
export default function parseCase<T>(caseStmt: Case<T>): {
    sql: string;
    params: any[];
};
//# sourceMappingURL=parseCase.d.ts.map