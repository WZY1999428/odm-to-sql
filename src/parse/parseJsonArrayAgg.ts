import parseCase from "./parseCase.js";
import { CaseMode } from "./operators/case.js";
import { isObject, quote } from "../utils/index.js";
import type { JsonArrayAgg } from "./operators/aggregate.js";
export default function parseJsonArrayAgg<T>(jsonArrayAgg: JsonArrayAgg<T>[]): string {
    let sqlStr = "";
    for (const item of jsonArrayAgg) {

        if (typeof item === "string") {
            sqlStr += ` JSON_ARRAYAGG(${quote(item)}) `;
            continue;
        }

        if (isObject(item)) {
            const { fields, as } = item;

            if (!fields) {
                throw new Error(
                    "fields is required in jsonArrayAgg object"
                );
            }

            let expression = "";

            if (typeof fields === "string") {
                expression = `JSON_ARRAYAGG(${quote(fields)})`;

            } else if (isObject(fields)) {
                if (item.case) {
                    item.case.mode = CaseMode.JSON_ARRAYAGG;
                    item.case.$whens.forEach((item: any) => {
                        if (!item.then) item.then = fields;
                    });
                    expression = `COALESCE(${parseCase(item.case)}, JSON_ARRAY())`;
                } else {
                    const jsonObject: string[] = [];
                    for (const [key, value] of Object.entries(fields)) {
                        if (typeof value === "string") {
                            jsonObject.push(`'${key}'`);
                            jsonObject.push(quote(value));
                        }
                    }
                    if (jsonObject.length) {
                        expression = `JSON_ARRAYAGG(JSON_OBJECT(${jsonObject.join(", ")}))`;
                    }
                }
            }

            if (expression) {
                sqlStr += `, ${expression}`;

                if (as) {
                    sqlStr += ` AS ${quote(as)}`;
                }

                sqlStr += " ";
            }
        }
    }
    return sqlStr;
}