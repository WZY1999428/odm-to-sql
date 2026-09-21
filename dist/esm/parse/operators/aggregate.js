// 1. 聚合函数
const AggregateFunctionsMap = {
    "$min": "MIN",
    "$max": "MAX",
    "$sum": "SUM",
    "$avg": "AVG",
    "$count": "COUNT"
};
// 2. 分组与过滤阶段 (用于 Aggregate 管道)
const PipelineStagesMap = {
    "$group": "GROUP BY",
    "$having": "HAVING"
};
export const JoinTypeMap = {
    inner: 'INNER JOIN',
    left: 'LEFT JOIN',
    right: 'RIGHT JOIN',
    full: 'FULL JOIN',
    self: 'self'
};
