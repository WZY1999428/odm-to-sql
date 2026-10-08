"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = {
    logger(sql, params) {
        console.log(sql, params);
    },
    loggerSql(sql, params) {
        params.forEach(p => sql = sql.replace("?", p));
        console.log(sql);
    }
};
exports.default = debug;
