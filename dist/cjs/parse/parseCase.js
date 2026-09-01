"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseCase;
const parseQuery_js_1 = __importDefault(require("./parseQuery.js"));
const index_js_1 = require("../utils/index.js");
const case_js_1 = require("./operators/case.js");
const parseJsonArrayAgg_js_1 = require("./parseJsonArrayAgg.js");
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
    for (const item of $whens) {
        const { when, then } = item;
        const { sql, params: queryParams } = (0, parseQuery_js_1.default)(when);
        params.push(...queryParams);
        whenClauses.push(`WHEN ${sql}`);
        if (typeof then === 'string') {
            whenClauses.push(` THEN ${(0, index_js_1.quote)(then)}`);
        }
        else if ((0, index_js_1.isObject)(then) && mode === case_js_1.CaseMode.JSON_ARRAYAGG) {
            const jsonObject = (0, parseJsonArrayAgg_js_1.joinJsonObject)(then);
            if (jsonObject) {
                whenClauses.push(` THEN JSON_OBJECT(${jsonObject})`);
            }
        }
    }
    if ($else && whenClauses.length > 0) {
        whenClauses.push(`ELSE ${(0, index_js_1.quote)($else)}`);
    }
    else {
        whenClauses.push(`ELSE JSON_ARRAY()`);
    }
    return { sql: `CASE ${whenClauses.join(' ')} END`, params };
}
