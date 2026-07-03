const MySqlODM = require('./dist/index.js');
const { Schema, FieldSchemaBuilder } = require('./dist/schema');
(async () => {
    console.log(Schema, FieldSchemaBuilder);
    const odm = new MySqlODM();
    await odm.use({
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "koa-serve"
    });
    console.log(odm.getModels());
})()