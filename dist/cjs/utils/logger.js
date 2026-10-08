"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = {
    logger(sql, params) {
        console.log(sql, params);
    },
    loggerSql(sql, params) {
        let formattedSql = sql;
        params.forEach(p => {
            let value;
            if (p === null || p === undefined) {
                value = 'NULL';
            }
            else if (typeof p === 'string') {
                // 转义单引号，防止 SQL 注入语法报错，并加上单引号包裹
                value = `'${p.replace(/'/g, "''")}'`;
            }
            else if (p instanceof Date) {
                value = `'${p.toISOString()}'`;
            }
            else {
                value = p;
            }
            // 使用 replace 依次替换第一个出现的 ?
            formattedSql = formattedSql.replace('?', value);
        });
        console.log(formattedSql);
    }
};
exports.default = debug;
