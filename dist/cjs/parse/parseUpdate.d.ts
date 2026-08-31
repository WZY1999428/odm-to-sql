import type { Update } from "./operators/index.js";
import { Schema } from "../schema/index.js";
export default function parseUpdate<T>(data: Update<T>, schema: Schema<T>): {
    sql: string;
    params: any[];
};
//# sourceMappingURL=parseUpdate.d.ts.map