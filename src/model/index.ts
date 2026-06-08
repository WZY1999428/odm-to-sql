import Cleint from "../client";
import Executor from "./executor";
import { Schema } from "../schema";
import type { Query } from "../parse/operators/index"
import type { FindOptions, FindOneOptions, InsertOptions, insertManyOptions, AggregationOptions } from "./options"


class Model<T> {
    ready: Promise<void>
    constructor(
        public table: string,
        public schema: Schema<T>,
        public client: Cleint
    ) {
        this.ready = this.createTable();
    };


    private async createTable() {
        const definition = this.schema.toTableDefinition();
        const sql = `
        CREATE TABLE IF NOT EXISTS \`${this.table}\` (
            ${definition}
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

        try {
            await this.client.execute(sql);
        } catch (err) {
            console.error(`[ODM] Failed to create table "${this.table}":`, err);
            throw err;
        }
    }
    async find(query?: Query<T>, options: FindOptions<T> = {}) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.find(query || {}, options);
    }

    async findOne(query?: Query<T>, options: FindOneOptions<T> = {}) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.findOne(query || {}, options);
    }

    async count(query?: Query<T>) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.count(query);
    }

    deleteOne(query?: Query<T>) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.deleteOne(query || {});
    }

    async insert(data: T, opt?: InsertOptions) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.insert(data, opt);
    }
    
    async insertMany(data: T[], opt?: insertManyOptions) {
        if (!Array.isArray(data)) throw new Error("[ODM] insertMany data must be an array");
        const execute = new Executor(this.client, this.table, this.schema, opt?.useTransaction ? await this.client.getConnection() : undefined)
        return execute.insertMany(data, opt);
    }


    async update(query: Query<T>, data: Partial<T>,) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.update(query, data);
    }

    async aggregate<P>(options: AggregationOptions<T>) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.aggregate(options);
    }

    execute(sql: string, params: any[]) {
        const execute = new Executor(this.client, this.table, this.schema)
        return execute.execute(sql, params);
    }

    /**
    *推荐当前使用连接池时使用
    * 从连接池借出一个绑定的执行器。
    * 注意：使用完毕后必须手动调用 executor.release() 归还连接。
    */
    async checkout(): Promise<Executor> {
        const conn = await this.client.getConnection();
        if (!conn) throw new Error("[ODM] Failed to get database connection");
        // 这里的第四个参数 release 传 false，表示 executor 执行方法后不自动释放
        return new Executor(this.client, this.table, this.schema, conn!);
    }


    /**
     * 自动事务包装器
     * 逻辑：获取连接 -> 开启事务 -> 执行回调 -> 提交 -> 释放
     * 报错：自动回滚 -> 抛出错误 -> 释放
     */
    async withTransaction<P = any>(callback: (model: Executor) => Promise<P>): Promise<P> {
        const execute = await this.checkout();
        let startd = false;
        try {
            await execute.beginTransaction();
            startd = true;
            const result = await callback(execute);
            await execute.commit();
            return result;
        } catch (error) {
            if (startd) await execute.rollback().catch(() => { });
            throw error;
        } finally {
            // 只有是连接池时才需要 release
            if (this.client.isPool) {
                execute.release();
            }
        }
    }

    async withPollConnection<P = any>(callback: (model: Executor) => Promise<P>): Promise<P> {
        const execute = await this.checkout();
        try {
            return await callback(execute);
        } finally {
            // 只有是连接池时才需要 release
            if (this.client.isPool) {
                execute.release();
            }
        }
    }
}




export default Model