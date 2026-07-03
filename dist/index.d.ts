import Client from "./client";
import type { ConnectionOptions } from "mysql2/promise";
import { Schema } from "./schema";
import Model from "./model";
declare class MySqlODM {
    models: Map<string, Model<any>>;
    conn: Client | null;
    constructor();
    use(options: ConnectionOptions, type?: 'connection' | 'pool'): Promise<void>;
    model<T>(table: string, schema?: Schema<T>): Model<T>;
    getModels(): MapIterator<string>;
}
export = MySqlODM;
//# sourceMappingURL=index.d.ts.map