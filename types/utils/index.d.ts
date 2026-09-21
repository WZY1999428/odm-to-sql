/**
 * 为 SQL 标识符（表名、字段名）添加反引号
 * 支持格式: "name" -> "`name`"
 * 支持格式: "user.name" -> "`user`.`name`"
 */
export declare function quote(identifier: string): string;
/**
 * 批量处理多个字段名
 */
export declare function quoteAll(identifiers: string[]): string;
export declare function parseJson(key: string): string;
export declare function isObject(value: any): boolean;
export declare function isStringArray(value: any): value is string[];
export declare function parseObjectKeys(datas: any): string;
//# sourceMappingURL=index.d.ts.map