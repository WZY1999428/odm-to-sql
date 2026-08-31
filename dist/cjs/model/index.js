"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executor_js_1 = __importDefault(require("./executor.js"));
class Model {
    table;
    schema;
    client;
    ready;
    constructor(table, schema, client) {
        this.table = table;
        this.schema = schema;
        this.client = client;
        this.ready = this.createTable();
    }
    ;
    async createTable() {
        const definition = this.schema.toTableDefinition();
        const sql = `
        CREATE TABLE IF NOT EXISTS \`${this.table}\` (
            ${definition.definition}
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
        try {
            await this.client.execute(sql);
            if (definition.alterTable) {
                await this.client.execute(definition.alterTable);
            }
        }
        catch (err) {
            console.error(`[ODM] Failed to create table "${this.table}":`, err);
            throw err;
        }
    }
    findMany(query, options = {}) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.findMany(query || {}, options);
    }
    findOne(query, options = {}) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.findOne(query || {}, options);
    }
    count(query) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.count(query);
    }
    deleteOne(query) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.deleteOne(query || {});
    }
    deleteMany(query) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.deleteMany(query || {});
    }
    insert(data, opt) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.insert(data, opt);
    }
    async insertMany(data, opt) {
        if (!Array.isArray(data))
            throw new Error("[ODM] insertMany data must be an array");
        const execute = new executor_js_1.default(this.client, this.table, this.schema, opt?.useTransaction ? await this.client.getConnection() : undefined);
        return execute.insertMany(data, opt);
    }
    update(query, data) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.update(query, data);
    }
    aggregate(options) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.aggregate(options);
    }
    clear() {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.clear();
    }
    execute(sql, params) {
        const execute = new executor_js_1.default(this.client, this.table, this.schema);
        return execute.execute(sql, params);
    }
    /**
    *推荐当前使用连接池时使用
    * 从连接池借出一个绑定的执行器。
    * 注意：使用完毕后必须手动调用 executor.release() 归还连接。
    */
    async checkout() {
        const conn = await this.client.getConnection();
        if (!conn)
            throw new Error("[ODM] Failed to get database connection");
        // 这里的第四个参数 release 传 false，表示 executor 执行方法后不自动释放
        return new executor_js_1.default(this.client, this.table, this.schema, conn);
    }
    /**
     * 自动事务包装器
     * 逻辑：获取连接 -> 开启事务 -> 执行回调 -> 提交 -> 释放
     * 报错：自动回滚 -> 抛出错误 -> 释放
     */
    async withTransaction(callback) {
        const execute = await this.checkout();
        let startd = false;
        try {
            await execute.beginTransaction();
            startd = true;
            const result = await callback(execute);
            await execute.commit();
            return result;
        }
        catch (error) {
            if (startd)
                await execute.rollback().catch(() => { });
            throw error;
        }
        finally {
            // 只有是连接池时才需要 release
            if (this.client.isPool) {
                execute.release();
            }
        }
    }
    async withPollConnection(callback) {
        const execute = await this.checkout();
        try {
            return await callback(execute);
        }
        finally {
            // 只有是连接池时才需要 release
            if (this.client.isPool) {
                execute.release();
            }
        }
    }
}
exports.default = Model;
//# sourceMappingURL=index.js.map