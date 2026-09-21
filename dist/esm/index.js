import Client from "./client.js";
import { Schema } from "./schema/index.js";
import Model from "./model/index.js";
class MySqlODM {
    models;
    conn = null;
    constructor() {
        this.models = new Map();
        console.log("Database connected");
    }
    async use(options, type = 'pool') {
        this.conn = type === 'connection'
            ? await Client.connection(options)
            : await Client.connectionPool(options);
    }
    async model(table, schema) {
        if (!this.conn)
            throw new Error("Database not connected");
        if (this.models.has(table))
            return this.models.get(table);
        if (!(schema instanceof Schema)) {
            throw new Error("schema must be an instance of Schema");
        }
        schema.table = table;
        const model = new Model(table, schema, this.conn);
        const fields = await model.execute(`SHOW COLUMNS FROM ${table}`, []);
        const notFields = [];
        for (const key in schema.fields) {
            if (!fields.some((item) => item.Field === key)) {
                notFields.push(key);
            }
        }
        if (notFields.length > 0) {
            // TODO: 创建缺失的字段
            for (const fieldName of notFields) {
                const uniqueGroupMap = new Map();
                const indexs = new Set();
                const config = schema.fields[fieldName];
                const { definition, alterTable } = schema.parseFields(fieldName, config, uniqueGroupMap, indexs);
                const sql = `ALTER TABLE \`${table}\` ADD COLUMN ${definition};`;
                await model.execute(sql, []);
                if (alterTable) {
                    await model.execute(alterTable, []);
                }
            }
            console.warn(`已自动添加新增字段: ${notFields.join(', ')}`);
        }
        this.models.set(table, model);
        return model;
    }
    buildColumnSQL(name, field) {
        let sql = `\`${name}\` ${field.type}`;
        if (field.length) {
            sql += `(${field.length})`;
        }
        if (field.nullable) {
            sql += ` NOT NULL`;
        }
        if (field.autoIncrement) {
            sql += ` AUTO_INCREMENT`;
        }
        return sql;
    }
    getModels() {
        return this.models.keys();
    }
}
export default MySqlODM;
