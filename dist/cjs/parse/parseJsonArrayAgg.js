"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseJsonArrayAgg;
exports.joinJsonObject = joinJsonObject;
const parseCase_js_1 = __importDefault(require("./parseCase.js"));
const case_js_1 = require("./operators/case.js");
const index_js_1 = require("../utils/index.js");
function parseJsonArrayAgg(jsonArrayAgg) {
    let sqlStr = "";
    let params = [];
    for (const item of jsonArrayAgg) {
        if (typeof item === "string") {
            sqlStr += ` JSON_ARRAYAGG(${(0, index_js_1.quote)(item)}) `;
            continue;
        }
        if ((0, index_js_1.isObject)(item)) {
            const { fields, as } = item;
            if (!fields) {
                throw new Error("fields is required in jsonArrayAgg object");
            }
            let expression = "";
            if (typeof fields === "string") {
                expression = `JSON_ARRAYAGG(${(0, index_js_1.quote)(fields)})`;
            }
            else if ((0, index_js_1.isObject)(fields)) {
                if (item.case) {
                    item.case.mode = case_js_1.CaseMode.JSON_ARRAYAGG;
                    item.case.$whens.forEach((item) => {
                        if (!item.then)
                            item.then = fields;
                    });
                    const { sql, params: caseParams } = (0, parseCase_js_1.default)(item.case);
                    params.push(...caseParams);
                    expression = `JSON_ARRAYAGG(${sql})`;
                }
                else {
                    const jsonObject = joinJsonObject(fields);
                    if (jsonObject) {
                        expression = `JSON_ARRAYAGG(JSON_OBJECT(${jsonObject}))`;
                    }
                }
            }
            if (expression) {
                sqlStr += `, ${expression}`;
                if (as) {
                    sqlStr += ` AS ${(0, index_js_1.quote)(as)}`;
                }
                sqlStr += " ";
            }
        }
    }
    return { sql: sqlStr, params };
}
function joinJsonObject(fields) {
    const jsonObject = [];
    for (const [key, value] of Object.entries(fields)) {
        if (typeof value === "string") {
            jsonObject.push(`'${key}'`);
            jsonObject.push((0, index_js_1.quote)(value));
        }
    }
    return jsonObject.join(" , ");
}
