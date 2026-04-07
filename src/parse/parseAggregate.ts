import { parseJson, isObject, isStringArray, quote } from "../utils";
import parseQuery from "./parseQuery"
import parseOrder from "./parseOrder";
import { JoinTypeMap } from "./operators/aggregate";
import {
    AggregationOptions, AggregateOption, OneOrMany
    , AggregateFields,
} from "./operators"
export default function parseAggregate<T>(table: string, options: AggregationOptions<T>): { sql: string, params: any } {
    let sqlStr: string = ""
    const params: any[] = []
    const { fields, specs, query, group, having, sort, joins, limit, offset } = options;
    if (Array.isArray(fields)) {
        if (!isStringArray(fields)) {
            throw new Error("fields must be string array");
        }
        sqlStr += ` ${fields.join(', ')}  `
    } else {
        sqlStr += ` * `
    }
    const specsSql = [];
    if (specs) {
        if (!isObject(specs)) {
            throw new Error("specs must be object");
        }

        if (specs.$max) specsSql.push(joinSpec<T>("MAX", specs.$max, params));

        if (specs.$min) specsSql.push(joinSpec<T>("MIN", specs.$min, params));

        if (specs.$sum) specsSql.push(joinSpec<T>("SUM", specs.$sum, params));

        if (specs.$avg) specsSql.push(joinSpec<T>("AVG", specs.$avg, params));

        if (specs.$count) specsSql.push(joinSpec<T>("COUNT", specs.$count, params));
    }
    sqlStr += `${specsSql.join(", ")}FROM ${quote(table)} `


    if (joins) {
        if (!Array.isArray) {
            throw new Error("joins must be array");
        }
        let asIndex = 0;
        const joinsSql = joins.map(item => {
            if (!isObject(item)) {
                throw new Error("joins must be array of object");
            }
            if (!item.table) {
                throw new Error("table is required");
            }
            if (!isObject(item.on) && item.type != 'self') {
                throw new Error("on is required");
            }
            // 1. 生成别名：优先用用户的，没有就自增
            const tableAlias = item.as || `t${asIndex++}`;

            // 2. 解析 ON 条件 (这里的 value 以后记得接 $ref 逻辑)
            let onStr = "";
            if (item.on) {
                onStr = Object.entries(item.on).map(([key, value]) => {
                    return `${quote(key)} = ${quote(value)}`;
                }).join(" AND ");
            }

            const joinOn = onStr ? ` ON ${onStr}` : "";
            // 3. 根据类型生成 SQL
            if (item.type === 'self') {
                return ` INNER JOIN ${quote(item.table)} AS ${quote(tableAlias)}${joinOn}`;
            } else {
                const joinType = JoinTypeMap[item.type || 'inner']; // 默认 inner
                return ` ${joinType} ${quote(item.table)} AS ${quote(tableAlias)}${joinOn}`;
            }
        }).join(" ")

        // 4. 组装到主 SQL
        // 注意：JOIN 是紧跟在 FROM table 之后的
        sqlStr += ` ${joinsSql}`;

    }


    if (query && Object.keys(query).length) {

        const { sql: sqlQuery, params: paramsQuery } = parseQuery(query);

        sqlStr += ` WHERE ${sqlQuery}`;

        params.push(...paramsQuery);

    }


    if (group && group.length) {
        sqlStr += ` GROUP BY ${group.join(', ')}`;
    }



    if (having && Object.keys(having).length) {

        const { sql: sqlQuery, params: paramsQuery } = parseQuery(having);

        sqlStr += ` HAVING ${sqlQuery}`;

        params.push(...paramsQuery);

    }


    if (sort && sort.length) {
        sqlStr += ` ${parseOrder(sort)}`;

    }


    if (isFinite(limit!)) {
        sqlStr += ` LIMIT ${limit}`;

    }

    if (isFinite(offset!)) {
        sqlStr += ` OFFSET ${offset}`;
    }

    return { sql: sqlStr, params }
}


type A<T> = OneOrMany<AggregateOption<T> | keyof T>;

function joinSpec<T>(type: string, spec: A<T>, params: any[]) {

    const parse = (spec: A<T>) => {

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

                const { sql, params: paramsWhere } = parseQuery(spec.where);

                where = ` WHERE ${sql} `;

                params.push(...paramsWhere);

            }

            if (spec.from) str += `( SELECT ${type}(${spec.field}) FROM ${quote(spec.from)}${where}) `;

            else str += ` ${type}(${spec.field}) `



            if (spec.as) str += `AS ${quote(spec.as)} `;

            else str += `AS ${type.toLocaleLowerCase()}_${spec.field as string} `



            return str;

        } else {

            return `${type}(${String(spec)}) AS ${type.toLocaleLowerCase()}_${String(spec)} `;

        }

    }

    if (Array.isArray(spec)) {

        const sql = [];

        for (const s of spec) {

            sql.push(parse(s));

        }

        return sql.join(' , ');

    }


    return parse(spec);
}


export function isAggregateOption<T>(value: any): value is AggregateOption<T> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}