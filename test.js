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
        id: { type: 'INT', primaryKey: true, autoIncrement: { enabled: true, start: 2000 } },
        name: { type: 'VARCHAR', length: 255, nullable: false },
        age: { type: 'INT', default: 0 },
        gender: FieldSchemaBuilder.VarChar(),
        email: FieldSchemaBuilder.VarChar(),
        phone: FieldSchemaBuilder.VarChar()

    });
    const userModel =await odm.model('users', userSchema);

    await userModel.insert({
        name: "123123123",
        age: 20,
        gender: "123123",
        phone: "123123123"
    })

    const result = await userModel.find({})
    console.log(result)
})() 