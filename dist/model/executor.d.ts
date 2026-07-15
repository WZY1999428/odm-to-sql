import type { Query, AggregationOptions } from "../parse/operators";
import type { FindOptions, FindOneOptions, InsertOptions, insertManyOptions } from "./options";
import { newConnection } from "../client";
import { Schema } from "../schema";
import Client from "../client";
import { ResultSetHeader } from "mysql2";
declare class Executor {
    private client;
    private table;
    private schema;
    private conn?;
    constructor(client: Client, table: string, schema: Schema<any>, conn?: newConnection | undefined);
    private buildFields;
    private buildLimit;
    /** 开启事务 */
    beginTransaction(): Promise<void>;
    /** 提交事务 */
    commit(): Promise<void>;
    /** 回滚事务 */
    rollback(): Promise<void>;
    release(): Promise<void>;
    execute(joinSql: string, params: any[]): Promise<import("mysql2").QueryResult>;
    findOne<T>(query: Query<T>, options?: FindOneOptions<T>): Promise<any>;
    count<T>(query?: Query<T>): Promise<number>;
    findMany<T>(query: Query<T>, options?: FindOptions<T>): Promise<any>;
    private prepareFields;
    insert<T>(data: T, opt?: InsertOptions): Promise<import("mysql2").QueryResult>;
    insertMany<T>(data: T[], opt?: insertManyOptions): Promise<ResultSetHeader>;
    update<T>(query: Query<T>, data: Partial<T>): Promise<ResultSetHeader>;
    updateMany<T>(query: Query<T>, data: Partial<T>): Promise<any>;
    deleteOne<T>(query: Query<T>): Promise<ResultSetHeader>;
    deleteMany<T>(query: Query<T>): Promise<ResultSetHeader>;
    clear(): Promise<ResultSetHeader>;
    aggregate<T, P>(options: AggregationOptions<T>): Promise<P[]>;
}
export default Executor;
//# sourceMappingURL=executor.d.ts.map