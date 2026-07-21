"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../parse/index.js");
const index_js_2 = require("../schema/index.js");
const index_js_3 = require("../utils/index.js");
class Executor {
    client;
    table;
    schema;
    conn;
    constructor(client, table, schema, conn) {
        this.client = client;
        this.table = table;
        this.schema = schema;
        this.conn = conn;
    }
    buildFields(fields = "*") {
        if (fields === "*")
            return "*";
        if (Array.isArray(fields)) {
            return fields.map(f => (0, index_js_3.quote)(f)).join(', ');
        }
        return fields; // 如果是字符串且不是 *，建议也处理下或者直接透传
    }
    buildLimit(limit, offset) {
        let limitSql = "";
        if (isFinite(limit) && limit > 0) {
            limitSql = `LIMIT ${Math.round(limit)}`;
            if (isFinite(offset) && offset > 0) {
                limitSql += ` OFFSET ${Math.round(offset)}`;
            }
        }
        return limitSql;
    }
    /** 开启事务 */
    async beginTransaction() {
        if (!this.conn)
            throw new Error("Connection lost");
        await this.conn.beginTransaction();
    }
    /** 提交事务 */
    async commit() {
        if (!this.conn)
            throw new Error("Connection lost");
        await this.conn.commit();
    }
    /** 回滚事务 */
    async rollback() {
        if (!this.conn)
            throw new Error("Connection lost");
        await this.conn.rollback();
    }
    async release() {
        if (!this.conn) {
            console.warn("[Schema Warning] 'release()' called when no connection is available.");
            return;
        }
        // 只有连接池模式才需要 release
        if (this.client.isPool) {
            if (this.conn && this.conn.release) {
                this.conn.release();
                this.conn = undefined; // 💡 防止重复释放（幂等性）
            }
        }
        else {
            // 单连接模式下，用户调用 release 通常是个误操作，或者想关闭连接
            console.warn("[Schema Warning] Single connection mode does not require 'release()'.");
        }
    }
    execute(joinSql, params) {
        if (this.conn) {
            return this.client.withConnExecute(this.conn, joinSql, params);
        }
        return this.client.execute(joinSql, params);
    }
    async findOne(query, options = {}) {
        if (typeof this.schema.hooks.beforeFind === "function") {
            query = await this.schema.hooks.beforeFind(query) || query;
        }
        const { fields = "*", sort = {} } = options;
        const { sql, params } = (0, index_js_1.parseQuery)(query);
        let joinSql = `SELECT ${this.buildFields(fields)} FROM ${(0, index_js_3.quote)(this.table)}`;
        if (sql)
            joinSql += ` WHERE ${sql} `;
        joinSql += ` ${(0, index_js_1.parseOrder)(sort)} LIMIT 1`;
        const result = await this.execute(joinSql, params);
        if (typeof this.schema.hooks.afterFind === "function") {
            return await this.schema.hooks.afterFind(result[0]);
        }
        return result[0];
    }
    async count(query) {
        let sqlWhere = "";
        let paramsWhere = [];
        if (query && Object.keys(query).length) {
            const { sql, params } = (0, index_js_1.parseQuery)(query);
            sqlWhere = sql;
            paramsWhere = params;
        }
        let joinSql = `SELECT COUNT(*) AS total FROM ${(0, index_js_3.quote)(this.table)}`;
        if (sqlWhere)
            joinSql += ` WHERE ${sqlWhere} `;
        const result = await this.execute(joinSql, paramsWhere);
        return Number(result?.[0]?.total || 0);
    }
    async findMany(query, options = {}) {
        if (typeof this.schema.hooks.beforeFind === "function") {
            query = await this.schema.hooks.beforeFind(query) || query;
        }
        const { sql, params } = (0, index_js_1.parseQuery)(query);
        const { limit = 0, offset = 0, fields = "*", sort = {} } = options;
        let joinSql = `SELECT ${this.buildFields(fields)} FROM ${(0, index_js_3.quote)(this.table)}`;
        if (sql)
            joinSql += ` WHERE ${sql} `;
        joinSql += ` ${(0, index_js_1.parseOrder)(sort)} ${this.buildLimit(limit, offset)} `;
        const results = await this.execute(joinSql, params);
        if (typeof this.schema.hooks.afterFind === "function") {
            return this.schema.hooks.afterFind(results);
        }
        return results;
    }
    prepareFields(data) {
        const fields = [];
        const params = [];
        for (const key in data) {
            const fieldType = this.schema.fieldsMap.get(key);
            if (!fieldType)
                continue;
            const value = data[key];
            const quotedKey = (0, index_js_3.quote)(key);
            fields.push(quotedKey);
            if (fieldType === index_js_2.DataType.Json && typeof value === "object" && value != null) {
                params.push(JSON.stringify(value));
            }
            else {
                params.push(value);
            }
        }
        return { fields, params };
    }
    async insert(data, opt = {}) {
        if (typeof this.schema.hooks.beforeInsert === "function") {
            data = await this.schema.hooks.beforeInsert(data) || data;
        }
        const { ignore = false, upsert = false } = opt;
        const { fields: insertFields, params } = this.prepareFields(data);
        let sql = `INSERT ${ignore ? 'IGNORE' : ''} INTO ${(0, index_js_3.quote)(this.table)} (${insertFields.join(', ')}) VALUES (${params.map(() => '?').join(', ')})`;
        // 处理 UPSERT 逻辑
        if (upsert) {
            const updateFields = Array.isArray(upsert)
                ? upsert
                : Object.keys(data).filter(k => this.schema.fieldsMap.has(k));
            const updateSql = updateFields
                .map(f => `${(0, index_js_3.quote)(f)} = VALUES(${(0, index_js_3.quote)(f)})`)
                .join(', ');
            sql += ` ON DUPLICATE KEY UPDATE ${updateSql}`;
        }
        const result = await this.execute(sql, params);
        if (typeof this.schema.hooks.afterInsert === "function") {
            return await this.schema.hooks.afterInsert(result);
        }
        return result;
    }
    async insertMany(data, opt = {}) {
        if (!Array.isArray(data) || data.length === 0)
            throw new Error("[ODM] insertMany data must be an array");
        const batch = [];
        const { ignore = false, upsert = false, useTransaction = false, batchSize = 100 } = opt;
        if (data.length > batchSize) {
            for (let i = 0; i < data.length; i += batchSize) {
                batch.push(data.slice(i, i + 100));
            }
        }
        else {
            batch.push(data);
        }
        const columns = Object.keys(data[0]);
        const quotedColumns = columns.filter(c => this.schema.fieldsMap.has(c)).map(c => (0, index_js_3.quote)(c)).join(', ');
        const results = {
            fieldCount: 0,
            affectedRows: 0,
            insertId: 0,
            info: '',
            serverStatus: 0,
            warningStatus: 0,
            changedRows: 0
        };
        const insert = async () => {
            for (const batchData of batch) {
                // 1. 生成占位符部分，例如 "(?, ?, ?)"
                const placeholders = `(${columns.map(() => '?').join(', ')})`;
                // 2. 重复占位符，生成 "(?, ?), (?, ?), (?, ?)"
                const valuesSql = batchData.map(() => placeholders).join(', ');
                // 3. 展平所有数据为一个一维数组 [val1, val2, val3, val4...]
                const params = batchData.flatMap(item => columns.map(col => item[col]));
                let sql = `INSERT ${ignore ? 'IGNORE' : ''} INTO ${(0, index_js_3.quote)(this.table)} (${quotedColumns}) VALUES ${valuesSql}`;
                if (upsert) {
                    const updateFields = Array.isArray(upsert)
                        ? upsert
                        : Object.keys(data).filter(k => this.schema.fieldsMap.has(k));
                    const updateSql = updateFields
                        .map(f => `${(0, index_js_3.quote)(f)} = VALUES(${(0, index_js_3.quote)(f)})`)
                        .join(', ');
                    sql += ` ON DUPLICATE KEY UPDATE ${updateSql}`;
                }
                const result = await this.execute(sql, params);
                results.affectedRows += result.affectedRows;
                results.warningStatus += result.warningStatus;
                results.fieldCount += result.fieldCount;
            }
            results.info = `Records: ${results.affectedRows}  Fields: ${results.fieldCount}  Warnings: ${results.warningStatus}`;
        };
        if (useTransaction) {
            let isTransactionStarted = false;
            try {
                await this.beginTransaction();
                isTransactionStarted = true;
                await insert();
                await this.commit();
            }
            catch (error) {
                if (isTransactionStarted)
                    await this.rollback().catch(() => { });
                throw error;
            }
        }
        else {
            await insert();
        }
        return results;
    }
    async update(query, data) {
        if (typeof this.schema.hooks.beforeUpdate === "function") {
            const result = await this.schema.hooks.beforeUpdate(query, data) || [query, data];
            query = result[0];
            data = result[1];
        }
        const { sql: whereSql, params: whereParams } = (0, index_js_1.parseQuery)(query);
        const { sql: assignments, params: values } = (0, index_js_1.parseUpdate)(data, this.schema);
        const finalSql = `
            UPDATE ${(0, index_js_3.quote)(this.table)}
            SET ${assignments} 
            WHERE ${whereSql} LIMIT 1
        `;
        const result = await this.execute(finalSql, [...values, ...whereParams]);
        if (typeof this.schema.hooks.afterUpdate === "function") {
            return await this.schema.hooks.afterUpdate(result);
        }
        return result;
    }
    async updateMany(query, data) {
        if (typeof this.schema.hooks.beforeUpdate === "function") {
            const result = await this.schema.hooks.beforeUpdate(query, data) || [query, data];
            query = result[0];
            data = result[1];
        }
        const { sql: whereSql, params: whereParams } = (0, index_js_1.parseQuery)(query);
        const { sql: assignments, params: values } = (0, index_js_1.parseUpdate)(data, this.schema);
        const finalSql = `
            UPDATE ${(0, index_js_3.quote)(this.table)}
            SET ${assignments} 
            WHERE ${whereSql}
        `;
        const result = await this.execute(finalSql, [...values, ...whereParams]);
        if (typeof this.schema.hooks.afterUpdate === "function") {
            return await this.schema.hooks.afterUpdate(result);
        }
        return result;
    }
    async deleteOne(query) {
        if (typeof this.schema.hooks.beforeDelete === "function") {
            query = await this.schema.hooks.beforeDelete(query) || query;
        }
        const { sql: whereSql, params: whereParams } = (0, index_js_1.parseQuery)(query);
        const finalSql = `DELETE FROM ${(0, index_js_3.quote)(this.table)} WHERE ${whereSql} LIMIT 1`;
        const result = await this.execute(finalSql, whereParams);
        if (typeof this.schema.hooks.afterDelete === "function") {
            return await this.schema.hooks.afterDelete(result);
        }
        return result;
    }
    async deleteMany(query) {
        if (typeof this.schema.hooks.beforeDelete === "function") {
            query = await this.schema.hooks.beforeDelete(query) || query;
        }
        const { sql: whereSql, params: whereParams } = (0, index_js_1.parseQuery)(query);
        const finalSql = `DELETE FROM ${(0, index_js_3.quote)(this.table)} WHERE ${whereSql}`;
        const result = await this.execute(finalSql, whereParams);
        if (typeof this.schema.hooks.afterDelete === "function") {
            return await this.schema.hooks.afterDelete(result);
        }
        return result;
    }
    async clear() {
        const finalSql = `DELETE FROM ${(0, index_js_3.quote)(this.table)}`;
        const result = await this.execute(finalSql, []);
        return result;
    }
    async aggregate(options) {
        if (typeof this.schema.hooks.beforeAggregate === "function") {
            options = await this.schema.hooks.beforeAggregate(options) || options;
        }
        const { sql, params } = (0, index_js_1.parseAggregate)(this.table, options);
        const finalSql = `SELECT ${sql}`;
        const result = await this.execute(finalSql, params);
        if (typeof this.schema.hooks.AFterAggregate === "function") {
            return await this.schema.hooks.AFterAggregate(result);
        }
        return result;
    }
}
exports.default = Executor;
//# sourceMappingURL=executor.js.map