"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseCase;
const index_js_1 = require("../utils/index.js");
const case_js_1 = require("./operators/case.js");
function parseCase(caseStmt) {
    if (!caseStmt) {
        return { sql: "", params: [] };
    }
    let params = [];
    const { $whens, $else, mode = case_js_1.CaseMode.DEFAULT } = caseStmt;
    if ($whens.length === 0) {
        throw new Error("Case statement must have at least one when clause or else clause");
    }
    const whenClauses = [];
    // for (const item of $whens) {
    //     const { when, then } = item;
    //     const { sql, params: queryParams } = parseQuery(when);
    //     params.push(...queryParams);
    //     whenClauses.push(`WHEN ${sql}`);
    //     if (typeof then === 'string') {
    //         whenClauses.push(` THEN ${quote(then)}`);
    //     }
    // }
    if ($else && whenClauses.length > 0) {
        whenClauses.push(`ELSE ${(0, index_js_1.quote)($else)}`);
    }
    else {
        whenClauses.push(`ELSE NULL`);
    }
    return { sql: `CASE ${whenClauses.join(' ')} END`, params };
}
