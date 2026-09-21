import { isObject, quote } from "../utils/index.js";
import { JoinTypeMap, } from "./operators/aggregate.js";
const joinOperators = {
    $eq: "=",
    $ne: "!=",
    $gt: ">",
    $gte: ">=",
    $lt: "<",
    $lte: "<=",
    $like: "LIKE",
    $notLike: "NOT LIKE",
    $in: "IN",
    $nin: "NOT IN",
    $isNull: "IS NULL",
    $isNotNull: "IS NOT NULL",
};
function parseJoin(joins) {
    if (!Array.isArray(joins)) {
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
                // 字段 = 字段
                if (typeof value === "string") {
                    return `${quote(key)} = ${quote(value)}`;
                }
                // 操作符条件
                if (value && typeof value === "object") {
                    return Object.entries(value).map(([operator, operand]) => {
                        const sqlOperator = joinOperators[operator];
                        if (!sqlOperator) {
                            throw new Error(`Unsupported JOIN operator: ${operator}`);
                        }
                        // IS NULL / IS NOT NULL
                        if (operator === "$isNull" || operator === "$isNotNull") {
                            return `${quote(key)} ${sqlOperator}`;
                        }
                        // IN / NOT IN
                        if (operator === "$in" || operator === "$nin") {
                            return `${quote(key)} ${sqlOperator} (${operand.map(() => "?").join(", ")})`;
                        }
                        // 普通操作符
                        return `${quote(key)} ${sqlOperator} ?`;
                    }).join(" AND ");
                }
                throw new Error(`Invalid JOIN condition: ${key}`);
            }).join(" AND ");
        }
        const joinOn = onStr ? ` ON ${onStr}` : "";
        // 3. 根据类型生成 SQL
        if (item.type === 'self') {
            return ` INNER JOIN ${quote(item.table)} AS ${quote(tableAlias)}${joinOn}`;
        }
        else {
            const joinType = JoinTypeMap[item.type || 'inner']; // 默认 inner
            return ` ${joinType} ${quote(item.table)} AS ${quote(tableAlias)}${joinOn}`;
        }
    }).join(" ");
    return joinsSql;
}
export default parseJoin;
