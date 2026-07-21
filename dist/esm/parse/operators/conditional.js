"use strict";
/*
        操作符	描述	示例
        $eq	等于	{ age: { $eq: 25 } }
        $ne	不等于	{ age: { $ne: 25 } }
        $gt	大于	{ age: { $gt: 25 } }
        $gte	大于等于	{ age: { $gte: 25 } }
        $lt	小于	{ age: { $lt: 25 } }
        $lte	小于等于	{ age: { $lte: 25 } }
        $in	在指定数据中	{ age: { $in: [25, 30, 35] } }
        $nin	不在指定数据中	{ age: { $nin: [25, 30, 35] } }
        $like	包含	{ name: { $like: "John" } }
        $nlike	不包含	{ name: { $nlike: "John" } }
        $between 在指定范围内	{ age: { $between: [20, 30] } }
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOperatorMap = void 0;
exports.QueryOperatorMap = {
    '$eq': "=",
    '$ne': "!=",
    '$gt': ">",
    '$gte': ">=",
    '$lt': "<",
    '$lte': "<=",
    '$in': "IN",
    '$nin': "NOT IN",
    '$like': "LIKE",
    '$nlike': "NOT LIKE",
    "$between": "BETWEEN"
};
// 也就是：这个数组本身的类型
// export type QueryOperators = keyof typeof QueryOperatorMap;
//# sourceMappingURL=conditional.js.map