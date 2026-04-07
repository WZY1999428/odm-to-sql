"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseQuery;
const index_1 = require("./operators/index");
const regex_1 = __importDefault(require("./operators/regex"));
const queryCache = new Map();
// 校验是否为合法的逻辑子项数组
function parseQuery(query) {
    const params = [];
    const parse = (query) => {
        const segments = [];
        const keys = Object.keys(query);
        for (let key of keys) {
            const value = query[key]; // 现在不报错了
            if (index_1.LogicalMap[key]) {
                if (!Array.isArray(value)) {
                    throwError(`Logical operator "${key}" requires an array of query objects. Received: ${JSON.stringify(value)}`);
                }
                // ✅ 新增：检查数组里每一项必须是对象
                if (!value.every(v => typeof v === 'object' && v !== null && !Array.isArray(v))) {
                    throwError(`Invalid item in "${key}": Each element must be a non-null plain object.`);
                }
                if (key == "$and" || key == "$or") {
                    const arr = value.map(parse);
                    segments.push(`(${arr.join(` ${index_1.LogicalMap[key]} `)})`);
                }
                else if (key === '$not') {
                    segments.push(`NOT (${value.map(parse).join(' AND ')})`);
                }
                else if (key === '$nor') {
                    const arr = value.map(parse);
                    segments.push(`NOT (${arr.join(' OR ')})`);
                }
                continue;
            }
            if (key === "$regex") {
                if (value && value instanceof RegExp) {
                    segments.push(`${key} REGEXP ?`);
                    params.push((0, regex_1.default)(value));
                }
                else {
                    throwError(`The value for "$regex" must be a JavaScript RegExp instance. Received: ${typeof value}`);
                }
                continue;
            }
            if (key.includes('.')) {
                const [column, ...path] = key.split('.');
                const jsonPath = `$.${path.join('.')}`;
                key = `${column}->>'${jsonPath}'`;
            }
            // 2. 处理普通字段
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const keys = Object.keys(value);
                for (const op of keys) {
                    if (!op.startsWith("$")) {
                        throwError(`Ambiguous query at "${key}": SQL databases do not support implicit nested objects ${JSON.stringify(value)}. Did you mean "${key}.field" (JSON path) or an operator like "$eq"?`);
                    }
                    if (!index_1.QueryOperatorMap[op]) {
                        throwError(`Invalid operator "${op}" at "${key}"`);
                    }
                    let val = value[op];
                    if (op === '$between') {
                        if (!Array.isArray(val)) {
                            throwError(`"$between" operator at "${key}" requires an array of exactly 2 numbers.`);
                        }
                        if (!val.every((v) => typeof v === 'number' && isFinite(v))) {
                            throwError(`Invalid values in "$between" for "${key}": All elements must be finite numbers.`);
                        }
                        segments.push(`${key} BETWEEN ? AND ?`);
                        params.push(Math.min(...val), Math.max(...val));
                    }
                    else if (index_1.QueryOperatorMap[op]) {
                        if (op == "$in" || op == "$nin") {
                            if (!Array.isArray(val)) {
                                throwError(`"${op}" operator at "${key}" expects an array. Received: ${typeof val}`);
                            }
                            ;
                            if (!val.every((v) => typeof v === "number" || typeof v === "string")) {
                                throwError(`Invalid collection for "${op}" at "${key}": Elements must be strings or numbers. (Found invalid item in: ${JSON.stringify(val)})`);
                            }
                            segments.push(`${key} ${index_1.QueryOperatorMap[op]} (${val.map(() => "?").join(",")})`);
                            params.push(...val);
                        }
                        else if (op == "$like" || op == "$nlike") {
                            if (val && typeof val !== "string" && typeof val !== 'number') {
                                throwError(`"${op}" at "${key}" only accepts string or number values. Received: ${typeof val}`);
                            }
                            segments.push(`${key} ${index_1.QueryOperatorMap[op]} ?`);
                            params.push(val);
                        }
                        else {
                            if (val && typeof val !== "string" && typeof val !== 'number') {
                                throwError(`"${op}" at "${key}" only accepts string or number values. Received: ${typeof val}`);
                            }
                            const sqlOp = index_1.QueryOperatorMap[op];
                            segments.push(`${key} ${sqlOp} ?`);
                            params.push(value[op]);
                        }
                    }
                    else if (typeof val === 'object') {
                        if (Array.isArray(val) && !val.every(v => typeof v === 'object' && v !== null && !Array.isArray(v))) {
                            throwError(`Invalid nested logic: "${op}" at "${key}" must contain an array of query objects. (Check: ${JSON.stringify(val)})`);
                        }
                    }
                }
            }
            else {
                segments.push(`${key} = ?`);
                params.push(value);
            }
        }
        // 关键：在 join 前再次过滤，确保没有空隙
        return segments.filter(Boolean).join(" AND ");
    };
    return {
        sql: parse(query),
        params
    };
}
function throwError(msg) {
    // 在信息前加上 [Query Error] 前缀，让它在日志中更显眼
    const error = new Error(`\n[Query Error]\nCause: ${msg}\n`);
    error.name = "QueryValidationError";
    throw error;
}
//# sourceMappingURL=parseQuery.js.map