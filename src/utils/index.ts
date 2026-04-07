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


export function parseObjectKeys(datas: any): string {
    if (!isObject(datas)) return '';
    
    let parts: string[] = [];
    const queue: any[] = [datas];

    while (queue.length) {
        const obj = queue.shift();
        // 1. 必须排序！保证 {a,b} 和 {b,a} 生成同一个 Key
        const keys = Object.keys(obj).sort(); 
        
        for (const key of keys) {
            const item = obj[key];
            // 2. 加入分隔符，防止 userid 和 user.id 混淆
            parts.push(key); 

            if (item && typeof item === 'object') {
                if (Array.isArray(item)) {
                    parts.push('[]'); // 标识数组结构
                    for (const i of item) {
                        if (isObject(i)) queue.push(i);
                    }
                } else {
                    parts.push('{}'); // 标识嵌套结构
                    queue.push(item);
                }
            }
        }
    }
    // 3. 用特殊字符连接，确保唯一性
    return parts.join('|'); 
}