import { isObject, isStringArray, quote } from "../utils/index.js";
import parseQuery from "./parseQuery.js"
import parseOrder from "./parseOrder.js";
import type { JsonArrayAgg } from "./operators/aggregate.js";
import parseJsonArrayAgg from "./parseJsonArrayAgg.js";
import parseJoin from "./parseJoin.js";

import {
    AggregationOptions, AggregateOption, OneOrMany
} from "./operators/index.js"
export default function parseAggregate<T>(table: string, options: AggregationOptions<T>): { sql: string, params: any } {

    let sqlStr: string = ""
    let sleectSqlStr: string = "";
    let specsSqlStr: string = "";
    let joinsSqlStr: string = "";

    const params: any[] = []
    const { fields, specs, query, group, having, sort, joins, limit, offset } = options;
    if (Array.isArray(fields)) {
        if (!isStringArray(fields)) {
            throw new Error("fields must be string array");
        }
        sleectSqlStr += ` ${fields.join(', ')}  `
    } else {
        sleectSqlStr += ` * `
    }



    if (specs && Array.isArray(specs)) {
        const specsSql = [];
        for (const spec of specs) {

            if (!isObject(spec)) {
                throw new Error("each spec must be object");
            }

            if (spec.$max) specsSql.push(joinSpec<T>("MAX", spec.$max, params));

            if (spec.$min) specsSql.push(joinSpec<T>("MIN", spec.$min, params));

            if (spec.$sum) specsSql.push(joinSpec<T>("SUM", spec.$sum, params));

            if (spec.$avg) specsSql.push(joinSpec<T>("AVG", spec.$avg, params));

            if (spec.$count) specsSql.push(joinSpec<T>("COUNT", spec.$count, params));
        }


        sqlStr += `, ${specsSql.join(", ")}FROM ${quote(table)} `
    }
<<<<<<< HEAD


    if (joins) {
        const joinsSql = parseJoin(joins);
        // 4. 组装到主 SQL
        // 注意：JOIN 是紧跟在 FROM table 之后的
        sqlStr += ` ${joinsSql}`;
=======
    specsSqlStr += `${specsSql.join(", ")}FROM ${quote(table)} `


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



            if (Array.isArray(item.jsonArrayAgg)) {
                const { sql: jsonArrayAggSql, params: jsonArrayAggParams } = parseJsonArrayAgg(item.jsonArrayAgg as JsonArrayAgg<T>[]);
                params.push(...jsonArrayAggParams);
                sleectSqlStr += ` ${jsonArrayAggSql} `
            }

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
        joinsSqlStr += ` ${joinsSql}`;

>>>>>>> f42f74db5b2d6ba2c15b6b5c9a3c57566a8e4349
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