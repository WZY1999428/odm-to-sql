const debug = {
    logger(sql: string, params: any[]) {
        console.log(sql, params);
    },
    loggerSql(sql: string, params: any[]) {
        params.forEach(p => sql = sql.replace("?", p));
        console.log(sql);
    }
}

export default debug;