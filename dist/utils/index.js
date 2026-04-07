"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quote = quote;
exports.quoteAll = quoteAll;
exports.parseJson = parseJson;
exports.isObject = isObject;
exports.isStringArray = isStringArray;
/**
 * 为 SQL 标识符（表名、字段名）添加反引号
 * 支持格式: "name" -> "`name`"
 * 支持格式: "user.name" -> "`user`.`name`"
 */
function quote(identifier) {
    // 如果是 * 则不处理
    if (!identifier || identifier === '*')
        return identifier;
    // 处理已存在的反引号，防止重复添加
    const clean = identifier.replace(/`/g, '');
    // 支持带点的路径（如 table.column）
    return clean
        .split('.')
        .map(part => `\`${part}\``)
        .join('.');
}
/**
 * 批量处理多个字段名
 */
function quoteAll(identifiers) {
    return identifiers.map(quote).join(', ');
}
function parseJson(key) {
    if (key.includes('.')) {
        const [column, ...path] = key.split('.');
        // 转换成 MySQL 的 JSON 提取语法：column->>'$.path'
        return `${quote(column)}->>'$.${path.join('.')}'`;
    }
    return `\`${key.replace(/`/g, '``')}\``;
}
function isObject(value) {
    return (value != null && typeof value === "object" && !Array.isArray(value));
}
function isStringArray(value) {
    return (Array.isArray(value) && value.every(item => typeof item === 'string'));
}
//# sourceMappingURL=index.js.map