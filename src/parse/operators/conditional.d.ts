export declare const QueryOperatorMap: {
    readonly $eq: "=";
    readonly $ne: "!=";
    readonly $gt: ">";
    readonly $gte: ">=";
    readonly $lt: "<";
    readonly $lte: "<=";
    readonly $in: "IN";
    readonly $nin: "NOT IN";
    readonly $like: "LIKE";
    readonly $nlike: "NOT LIKE";
    readonly $between: "BETWEEN";
};
export interface QueryOperators<V> {
    /** 等于  {age:{$eq:1}} */
    $eq?: V;
    /** 不等于 {age:{$ne:1}} */
    $ne?: V;
    /** 大于  {age:{$gt:1}}*/
    $gt?: V;
    /** 大于等于 {ege:{$gte:1}}*/
    $gte?: V;
    /** 小于  {age:{$lt:1}} */
    $lt?: V;
    /** 小于等于 { age:{$lte:1}} */
    $lte?: V;
    /** 包含  {age:{$in:[1,2,3]}} */
    $in?: V[];
    /** 不包含  {age:{$nin:[1,2,3]}}*/
    $nin?: V[];
    /** 模糊匹配 { name: { $like: "John" },{nickname: { $like: "Jo%" }} ,{nickname: { $like: "%Jo" }*/
    $like?: string;
    /** 模糊匹配 不包含 { name: { $nlike: "John" } } */
    $nlike?: string;
    /** 范围查询 */
    $between?: [V, V];
}
//# sourceMappingURL=conditional.d.ts.map