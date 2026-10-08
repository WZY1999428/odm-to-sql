const debug = {
    logger(sql, params) {
        console.log(sql, params);
    },
    loggerSql(sql, params) {
        params.forEach(p => sql = sql.replace("?", p));
        console.log(sql);
    }
};
export default debug;
