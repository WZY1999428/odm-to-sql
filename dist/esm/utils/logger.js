import mysql2 from "mysql2";
const debug = {
    logger(sql, params) {
        console.log(sql, params);
    },
    loggerSql(sql, params) {
        const formattedSql = mysql2.format(sql, params);
        console.log(formattedSql);
    }
};
export default debug;
