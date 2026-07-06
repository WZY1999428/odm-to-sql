const MySqlODM = require('./dist/index.js');
const { Schema, FieldSchemaBuilder } = require('./dist/schema');
(async () => {
    const odm = new MySqlODM();
    await odm.use({
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "koa-serve"
    });
    const userSchema = new Schema({
        id: { type: 'INT', primaryKey: true, autoIncrement: true },
        name: { type: 'VARCHAR', length: 255, nullable: false },
        age: { type: 'INT', default: 0 },

    });
    const userModel = odm.model('users', userSchema);

    await userModel.insert({
        name: "123123123",
        age: 20
    })

    const result = await userModel.find({})
    console.log(result)
})()