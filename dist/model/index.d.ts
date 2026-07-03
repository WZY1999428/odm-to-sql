import Cleint from "../client";
import Executor from "./executor";
import { Schema } from "../schema";
import type { Query } from "../parse/operators/index";
import type { FindOptions, FindOneOptions, InsertOptions, insertManyOptions, AggregationOptions } from "./options";
declare class Model<T> {
    table: string;
    schema: Schema<T>;
    client: Cleint;
    ready: Promise<void>;
    constructor(table: string, schema: Schema<T>, client: Cleint);
    private createTable;
    find(query?: Query<T>, options?: FindOptions<T>): Promise<any>;
    findOne(query?: Query<T>, options?: FindOneOptions<T>): Promise<any>;
    count(query?: Query<T>): Promise<number>;
    deleteOne(query?: Query<T>): Promise<import("mysql2").ResultSetHeader>;
    insert(data: T, opt?: InsertOptions): Promise<import("mysql2").QueryResult>;
    insertMany(data: T[], opt?: insertManyOptions): Promise<import("mysql2").ResultSetHeader>;
    update(query: Query<T>, data: Partial<T>): Promise<void | import("mysql2").ResultSetHeader>;
    aggregate<P>(options: AggregationOptions<T>): Promise<unknown[]>;
    execute(sql: string, params: any[]): Promise<import("mysql2").QueryResult>;
    /**
    *推荐当前使用连接池时使用
    * 从连接池借出一个绑定的执行器。
    * 注意：使用完毕后必须手动调用 executor.release() 归还连接。
    */
    checkout(): Promise<Executor>;
    /**
     * 自动事务包装器
     * 逻辑：获取连接 -> 开启事务 -> 执行回调 -> 提交 -> 释放
     * 报错：自动回滚 -> 抛出错误 -> 释放
     */
    withTransaction<P = any>(callback: (model: Executor) => Promise<P>): Promise<P>;
    withPollConnection<P = any>(callback: (model: Executor) => Promise<P>): Promise<P>;
}
export default Model;
//# sourceMappingURL=index.d.ts.map