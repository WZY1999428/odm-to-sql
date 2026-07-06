"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const client_1 = __importDefault(require("./client"));
const schema_1 = require("./schema");
const model_1 = __importDefault(require("./model"));
class MySqlODM {
    models;
    conn = null;
    constructor() {
        this.models = new Map();
        console.log("Database connected");
    }
    async use(options, type = 'pool') {
        this.conn = type === 'connection'
            ? await client_1.default.connection(options)
            : await client_1.default.connectionPool(options);
    }
    async model(table, schema) {
        if (!this.conn)
            throw new Error("Database not connected");
        if (this.models.has(table))
            return this.models.get(table);
        if (!(schema instanceof schema_1.Schema)) {
            throw new Error("schema must be an instance of Schema");
        }
        schema.table = table;
        const model = new model_1.default(table, schema, this.conn);
        const fields = await model.execute("SHOW COLUMNS FROM users ", []);
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
                const config = schema.fields[fieldName];
                const { definition, alterTable } = schema.parseFields(fieldName, config, uniqueGroupMap);
                const sql = `ALTER TABLE \`${table}\` ADD COLUMN ${definition};`;
                await model.execute(sql, []);
                if (alterTable) {
                    await model.execute(alterTable, []);
                }
            }
            console.warn(`已自动添加新增字段: ${notFields.join(', ')}`);
        }
        this.models.set(table, model);
        return this.models.get(table);
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
module.exports = MySqlODM;
//# sourceMappingURL=index.js.map