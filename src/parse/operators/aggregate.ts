import { Query } from "./index.js";
import { OrderBy } from "../parseOrder.js";
// 1. 聚合函数
const AggregateFunctionsMap = {
    "$min": "MIN",
    "$max": "MAX",
    "$sum": "SUM",
    "$avg": "AVG",
    "$count": "COUNT"
} as const;
export type AggregateOps = keyof typeof AggregateFunctionsMap;

// 2. 分组与过滤阶段 (用于 Aggregate 管道)
const PipelineStagesMap = {
    "$group": "GROUP BY",
    "$having": "HAVING"

} as const;



export type PipelineStages = keyof typeof PipelineStagesMap

export type AggregateOption<T> = {
    field: T
    as?: string,
    from?: string,
    where?: Query<unknown>
}

// 定义一个“单体或数组”的辅助类型
export type OneOrMany<T> = T | T[];

// 关键点：OneOrMany 让它可以是对象，也可以是对象数组

export type AggregateFields<T> = {
    [key in AggregateOps]?: OneOrMany<AggregateOption<T> | keyof T>;
} & {
    $count?: OneOrMany<Partial<{ field: keyof T | '*'; as: string; from: string; where: Query<unknown> }> | keyof T | '*'>;
}


type ColumnFields<T> = keyof T | string;

/** inner 内连接  left 左连接  right 右连接  full 全连接 self 自连接 */
type JoinType = 'inner' | 'left' | 'right' | 'full' | 'self';


export const JoinTypeMap = {
    inner: 'INNER JOIN',
    left: 'LEFT JOIN',
    right: 'RIGHT JOIN',
    full: 'FULL JOIN',
    self: 'self'
}

// 1. 定义基础的普通 Join
interface NormalJoin {
    table: string;
    on: Record<string, string>; // 必填
    type?: JoinType; 
    as?: string;
}

// 2. 定义特殊的 Self Join
interface SelfJoin {
    table: string;
    on?: Record<string, string>; // 可选
    type: 'self'; // 必须显式指定为 'self'
    as: string;   // 自连接必须有别名，否则字段全冲突
}

// 3. 组合导出

type Join =  NormalJoin | SelfJoin;

export type AggregationOptions<T> = {
    fields: ColumnFields<T>[];      // 支持 ['u.id', 'p.title']
    specs?: AggregateFields<T>;      // 选填：你要聚合哪些字段？
    query?: Query<T>;              // 选填：过滤条件 (WHERE)
    group?: (keyof T)[];         // 选填：按什么分组？
    having?: Query<T>;             // 选填：分组后的过滤 (HAVING)
    sort?: OrderBy<T>; // 排序
    joins?: Join[];              // 连表
    limit?: number;
    offset?: number
}