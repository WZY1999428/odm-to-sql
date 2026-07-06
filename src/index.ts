import Client from "./client";
import type { ConnectionOptions } from "mysql2/promise"
import { Schema } from "./schema";
import Model from "./model";



class MySqlODM {
    models: Map<string, Model<any>>
    conn: Client | null = null;

    constructor() {
        this.models = new Map();
        console.log("Database connected");
    }

    async use(options: ConnectionOptions, type: 'connection' | 'pool' = 'pool') {
        this.conn = type === 'connection'
            ? await Client.connection(options)
            : await Client.connectionPool(options);
    }

    async model<T>(table: string, schema?: Schema<T>) {
        if (!this.conn) throw new Error("Database not connected");
        if (this.models.has(table)) return this.models.get(table) as Model<T>;
        if (!(schema instanceof Schema)) {
            throw new Error("schema must be an instance of Schema");
        }
        schema.table = table;
        const model = new Model<T>(table, schema, this.conn!);
        const fields = await model.execute("SHOW COLUMNS FROM users ", []);
        const notFields = [];
        for (const key in schema.fields) {
            if (!(fields as any[]).some((item: any) => item.Field === key)) {
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
        return this.models.get(table) as Model<T>;
    }

    private buildColumnSQL(name: string, field: any) {
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

export = MySqlODM;