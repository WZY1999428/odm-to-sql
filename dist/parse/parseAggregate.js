"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseAggregate;
exports.isAggregateOption = isAggregateOption;
const utils_1 = require("../utils");
function parseAggregate(table, options) {
    const sql = [];
    const params = [];
    const { fields, specs, query, $group, $having, sort, joins, limit, offset } = options;
    if (Array.isArray(fields)) {
        if (!(0, utils_1.isStringArray)(fields)) {
            throw new Error("fields must be string array");
        }
        sql.push(` ${fields.join(', ')}  `);
    }
    if (specs) {
        if (!(0, utils_1.isObject)(specs)) {
            throw new Error("specs must be object");
        }
        if (specs.$max)
            sql.push(joinSpec("MAX", specs.$max));
        if (specs.$min)
            sql.push(joinSpec("MIN", specs.$min));
        if (specs.$sum)
            sql.push(joinSpec("SUM", specs.$sum));
        if (specs.$count)
            sql.push(joinSpec("COUNT", specs.$count));
    }
    return { sql: sql.join(','), params };
}
function joinSpec(type, spec) {
    const parse = (spec) => {
        if (Array.isArray(spec)) {
            throw new Error("spec must be object or string");
        }
        if (isAggregateOption(spec)) {
            if (!spec.field) {
                throw new Error("field is required");
            }
            let str = "";
            if (spec.from)
                str += `( SELECT ${type}(${spec.field}) FROM ${(0, utils_1.quote)(spec.from)} ) `;
            else
                str += ` ${(0, utils_1.quote)(type)}(${spec.field}) `;
            if (spec.as)
                str += ` AS ${(0, utils_1.quote)(spec.as)}`;
            else
                str += ` AS ${type.toLocaleLowerCase()}_${spec.field}`;
            return str;
        }
        else {
            return ` ${type}(${String(spec)}) as ${type.toLocaleLowerCase()}_${String(spec)}`;
        }
    };
    console.log(type);
    if (Array.isArray(spec)) {
        const sql = [];
        for (const s of spec) {
            sql.push(parse(s));
        }
        return sql.join(' ,');
    }
    return parse(spec);
}
function isAggregateOption(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
//# sourceMappingURL=parseAggregate.js.map