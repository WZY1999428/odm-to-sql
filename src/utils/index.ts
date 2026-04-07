/**
 * 为 SQL 标识符（表名、字段名）添加反引号
 * 支持格式: "name" -> "`name`"
 * 支持格式: "user.name" -> "`user`.`name`"
 */
export function quote(identifier: string): string {
    // 如果是 * 则不处理
    if (!identifier || identifier === '*') return identifier;

    // 处理已存在的反引号，防止重复添加
    const clean = identifier.replace(/`/g, '');

    // 支持带点的路径（如 table.column）
    return `\`${clean}\``
}

/**
 * 批量处理多个字段名
 */
export function quoteAll(identifiers: string[]): string {
    return identifiers.map(quote).join(', ');
}



export function parseJson(key: string) {
    if (key.includes('.')) {
        const [column, ...path] = key.split('.');
        // 转换成 MySQL 的 JSON 提取语法：column->>'$.path'
        return `${quote(column as string)}->>'$.${path.join('.')}'`;
    }
    return `\`${key.replace(/`/g, '``')}\``;
}



export function isObject(value: any) {
    return (value != null && typeof value === "object" && !Array.isArray(value));
}

export function isStringArray(value: any) {
    return (Array.isArray(value) && value.every(item => typeof item === 'string'));
}