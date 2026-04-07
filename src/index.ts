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

    model<T>(table: string, schema?: Schema<T>) {
        if (!this.conn) throw new Error("Database not connected");
        if (this.models.has(table)) return this.models.get(table) as Model<T>;
        if (!(schema instanceof Schema)) {
            throw new Error("schema must be an instance of Schema");
        }
        schema.table = table;
        const model = new Model<T>(table, schema, this.conn!);
        this.models.set(table, model);
        return this.models.get(table) as Model<T>;
    }

    getModels() {
        return this.models.keys();
    }
}

export default MySqlODM;