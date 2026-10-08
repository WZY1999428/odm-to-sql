import mysql2 from "mysql2";
const debug = {
    logger(sql: string, params: any[]) {
        console.log(sql, params);
    },
    loggerSql(sql: string, params: any[]) {
        const formattedSql = mysql2.format(sql, params);
        console.log(formattedSql);
    }
}

export default debug;