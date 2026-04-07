import type { Update } from "./operators/index";
import { Schema } from "../schema";
export default function parseUpdate<T>(data: Update<T>, schema: Schema<T>): {
    sql: string;
    params: any[];
};
//# sourceMappingURL=parseUpdate.d.ts.map