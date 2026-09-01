import parseQuery from "./parseQuery.js";
import { isObject, quote } from "../utils/index.js";
import type { Case } from "./operators/case.js";
import { CaseMode } from "./operators/case.js";
import { joinJsonObject } from "./parseJsonArrayAgg.js"
export default function parseCase<T>(caseStmt: Case<T>): { sql: string; params: any[] } {
    if (!caseStmt) {
        return { sql: "", params: [] };
    }
    let params: any[] = [];
    const { $whens, $else, mode = CaseMode.DEFAULT } = caseStmt;
    if ($whens.length === 0) {
        throw new Error("Case statement must have at least one when clause or else clause");
    }
    const whenClauses: string[] = [];

    for (const item of $whens) {
        const { when, then } = item;
        const { sql, params: queryParams } = parseQuery(when);
        params.push(...queryParams);
        whenClauses.push(`WHEN ${sql}`);
        if (typeof then === 'string') {
            whenClauses.push(` THEN ${quote(then)}`);
        } else if (isObject(then) && mode === CaseMode.JSON_ARRAYAGG) {
            const jsonObject = joinJsonObject(then);
            if (jsonObject) {
                whenClauses.push(` THEN JSON_OBJECT(${jsonObject})`);
            }
        }
    }

    if ($else && whenClauses.length > 0) {
        whenClauses.push(`ELSE ${quote($else as string)}`);
    } else {
        whenClauses.push(`ELSE NULL`);
    }

    return { sql: `CASE ${whenClauses.join(' ')} END`, params };
}

