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
    model(table, schema) {
        if (!this.conn)
            throw new Error("Database not connected");
        if (this.models.has(table))
            return this.models.get(table);
        if (!(schema instanceof schema_1.Schema)) {
            throw new Error("schema must be an instance of Schema");
        }
        schema.table = table;
        const model = new model_1.default(table, schema, this.conn);
        this.models.set(table, model);
        return this.models.get(table);
    }
    getModels() {
        return this.models.keys();
    }
}
module.exports = MySqlODM;
//# sourceMappingURL=index.js.map