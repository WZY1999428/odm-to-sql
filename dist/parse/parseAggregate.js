"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseAggregate;
exports.isAggregateOption = isAggregateOption;
const utils_1 = require("../utils");
const parseQuery_1 = __importDefault(require("./parseQuery"));
const parseOrder_1 = __importDefault(require("./parseOrder"));
const aggregate_1 = require("./operators/aggregate");
function parseAggregate(table, options) {
    let sqlStr = "";
    const params = [];
    const { fields, specs, query, group, having, sort, joins, limit, offset } = options;
    if (Array.isArray(fields)) {
        if (!(0, utils_1.isStringArray)(fields)) {
            throw new Error("fields must be string array");
        }
        sqlStr += ` ${fields.join(', ')}  `;
    }
    else {
        sqlStr += ` * `;
    }
    const specsSql = [];
    if (specs) {
        if (!(0, utils_1.isObject)(specs)) {
            throw new Error("specs must be object");
        }
        if (specs.$max)
            specsSql.push(joinSpec("MAX", specs.$max, params));
        if (specs.$min)
            specsSql.push(joinSpec("MIN", specs.$min, params));
        if (specs.$sum)
            specsSql.push(joinSpec("SUM", specs.$sum, params));
        if (specs.$avg)
            specsSql.push(joinSpec("AVG", specs.$avg, params));
        if (specs.$count)
            specsSql.push(joinSpec("COUNT", specs.$count, params));
    }
    sqlStr += `${specsSql.join(", ")}FROM ${(0, utils_1.quote)(table)} `;
    if (joins) {
        if (!Array.isArray) {
            throw new Error("joins must be array");
        }
        let asIndex = 0;
        const joinsSql = joins.map(item => {
            if (!(0, utils_1.isObject)(item)) {
                throw new Error("joins must be array of object");
            }
            if (!item.table) {
                throw new Error("table is required");
            }
            if (!(0, utils_1.isObject)(item.on) && item.type != 'self') {
                throw new Error("on is required");
            }
            // 1. 生成别名：优先用用户的，没有就自增
            const tableAlias = item.as || `t${asIndex++}`;
            // 2. 解析 ON 条件 (这里的 value 以后记得接 $ref 逻辑)
            let onStr = "";
            if (item.on) {
                onStr = Object.entries(item.on).map(([key, value]) => {
                    return `${(0, utils_1.quote)(key)} = ${(0, utils_1.quote)(value)}`;
                }).join(" AND ");
            }
            const joinOn = onStr ? ` ON ${onStr}` : "";
            // 3. 根据类型生成 SQL
            if (item.type === 'self') {
                return ` INNER JOIN ${(0, utils_1.quote)(item.table)} AS ${(0, utils_1.quote)(tableAlias)}${joinOn}`;
            }
            else {
                const joinType = aggregate_1.JoinTypeMap[item.type || 'inner']; // 默认 inner
                return ` ${joinType} ${(0, utils_1.quote)(item.table)} AS ${(0, utils_1.quote)(tableAlias)}${joinOn}`;
            }
        }).join(" ");
        // 4. 组装到主 SQL
        // 注意：JOIN 是紧跟在 FROM table 之后的
        sqlStr += ` ${joinsSql}`;
    }
    if (query && Object.keys(query).length) {
        const { sql: sqlQuery, params: paramsQuery } = (0, parseQuery_1.default)(query);
        sqlStr += ` WHERE ${sqlQuery}`;
        params.push(...paramsQuery);
    }
    if (group && group.length) {
        sqlStr += ` GROUP BY ${group.join(', ')}`;
    }
    if (having && Object.keys(having).length) {
        const { sql: sqlQuery, params: paramsQuery } = (0, parseQuery_1.default)(having);
        sqlStr += ` HAVING ${sqlQuery}`;
        params.push(...paramsQuery);
    }
    if (sort && sort.length) {
        sqlStr += ` ${(0, parseOrder_1.default)(sort)}`;
    }
    if (isFinite(limit)) {
        sqlStr += ` LIMIT ${limit}`;
    }
    if (isFinite(offset)) {
        sqlStr += ` OFFSET ${offset}`;
    }
    return { sql: sqlStr, params };
}
function joinSpec(type, spec, params) {
    const parse = (spec) => {
        if (Array.isArray(spec)) {
            throw new Error("spec must be object or string");
        }
        if (isAggregateOption(spec)) {
            if (!spec.field) {
                throw new Error("field is required");
            }
            let str = "";
            let where = "";
            if (spec.where && Object.keys(spec.where).length) {
                const { sql, params: paramsWhere } = (0, parseQuery_1.default)(spec.where);
                where = ` WHERE ${sql} `;
                params.push(...paramsWhere);
            }
            if (spec.from)
                str += `( SELECT ${type}(${spec.field}) FROM ${(0, utils_1.quote)(spec.from)}${where}) `;
            else
                str += ` ${type}(${spec.field}) `;
            if (spec.as)
                str += `AS ${(0, utils_1.quote)(spec.as)} `;
            else
                str += `AS ${type.toLocaleLowerCase()}_${spec.field} `;
            return str;
        }
        else {
            return `${type}(${String(spec)}) AS ${type.toLocaleLowerCase()}_${String(spec)} `;
        }
    };
    if (Array.isArray(spec)) {
        const sql = [];
        for (const s of spec) {
            sql.push(parse(s));
        }
        return sql.join(' , ');
    }
    return parse(spec);
}
function isAggregateOption(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
//# sourceMappingURL=parseAggregate.js.map