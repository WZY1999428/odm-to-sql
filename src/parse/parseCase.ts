import parseQuery from "./parseQuery.js";
import { isObject, quote } from "../utils/index.js";
import type { Case } from "./operators/case.js";
import { CaseMode } from "./operators/case.js";
import parseJsonArrayAgg from "./parseJsonArrayAgg.js"
export default function parseCase<T>(caseStmt: Case<T>): string {
    if (!caseStmt) {
        return "";
    }
    const { $whens, $else, mode = CaseMode.DEFAULT } = caseStmt;
    if ($whens.length === 0) {
        throw new Error("Case statement must have at least one when clause or else clause");
    }
    const whenClauses: string[] = [];

    for (const item of $whens) {
        const { when, then } = item;
        if (typeof then === 'string') {
            whenClauses.push(` WHEN ${parseQuery(when)} THEN ${quote(then)} `);
        } else if (mode === CaseMode.JSON_ARRAYAGG) {
            if (isObject(when)) whenClauses.push(` WHEN ${parseQuery(when)} `);
        }
    }

    if ($else && whenClauses.length > 0) {
        whenClauses.push(`ELSE ${quote($else as string)}`);
    }

    return `CASE ${whenClauses.join(' ')} END`
}

