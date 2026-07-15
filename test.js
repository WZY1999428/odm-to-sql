const MySqlODM = require('./dist/index.js');
const { Schema, FieldSchemaBuilder, DataType } = require('./dist/schema');
(async () => {
    const odm = new MySqlODM();
    await odm.use({
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "koa-serve"
    });

    const userSchema = new Schema({
        id: { type: 'int', primaryKey: true, autoIncrement: { enabled: true, start: 2000 } },
        name: { type: 'varchar', length: 255, nullable: false },
        age: { type: DataType.Int, default: 0 },
        gender: FieldSchemaBuilder.VarChar(),
        email: FieldSchemaBuilder.VarChar(),
        phone: FieldSchemaBuilder.VarChar()

    });
    
    const userModel = await odm.model('users', userSchema);
    const ret = await userModel.clear()
    console.log('Clear result:', ret);
    await userModel.insert({ name: 'John Doe', gender: 'male', email: 'john.doe@example.com' })
    console.log('User inserted successfully');
    console.log(await userModel.find({}))
})() 