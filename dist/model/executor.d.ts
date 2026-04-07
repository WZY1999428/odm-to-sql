import type { Query } from "../parse/operators";
import type { FindOptions, FindOneOptions, InsertOptions, UpdateOptions, insertManyOptions } from "./options";
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
    private execute;
    find<T>(query: Query<T>, options?: FindOptions<T>): Promise<any>;
    findOne<T>(query: Query<T>, options?: FindOneOptions<T>): Promise<any>;
    count<T>(query?: Query<T>): Promise<number>;
    findMany<T>(query: Query<T>, options?: FindOneOptions<T>): Promise<any>;
    private prepareFields;
    insert<T>(data: T, opt?: InsertOptions): Promise<import("mysql2").QueryResult>;
    insertMany<T>(data: T[], opt?: insertManyOptions): Promise<ResultSetHeader>;
    update<T>(query: Query<T>, data: Partial<T>, opt?: UpdateOptions): Promise<void | ResultSetHeader>;
    updateMany<T>(query: Query<T>, data: Partial<T>, opt?: UpdateOptions): Promise<void | ResultSetHeader>;
    deleteOne<T>(query: Query<T>): Promise<ResultSetHeader>;
    deleteMany<T>(query: Query<T>): Promise<ResultSetHeader>;
    aggregation<P, T>(): Promise<P[]>;
}
export default Executor;
//# sourceMappingURL=executor.d.ts.map