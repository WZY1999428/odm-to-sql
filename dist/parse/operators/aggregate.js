"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=aggregate.js.map