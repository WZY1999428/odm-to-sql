import { Schema, DataType, FieldSchemaBuilder } from "./src/schema";
import MySqlODM from "./src/index"
// import parseUpdate from "./src/parse/parseUpdate"
const odm = new MySqlODM();

type User = {
    id?: number,
    name: string,
    email: string,
    age: number,
    aaaa: number,
    json: any
}

(async () => {
    await odm.use({
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "1111"
    }, "connection")

    const user = odm.model<User>("user", new Schema<User>({
        id: FieldSchemaBuilder.Define(DataType.Int, { primary: true, autoIncrement: true }),
        name: FieldSchemaBuilder.VarChar(),
        email: FieldSchemaBuilder.VarChar(),
        age: FieldSchemaBuilder.Define(DataType.Int),
        aaaa: FieldSchemaBuilder.Define(DataType.Int, { nullable: true }),
        json: FieldSchemaBuilder.Define(DataType.Json)
    }));

    // const datas: User[] = [];
    // for (let i = 0; i < 1000; i++) {
    //     datas.push({
    //         name: `name-${i}`,
    //         email: `email-${i}`,
    //         age: i,
    //         aaaa: i,
    //         json: { a: 1, b: 2 }
    //     })
    // }
    // await user.insertMany(datas);
    // const reslut = await user.deleteOne({ id: 1 })
    const reslut = await user.count({
        age: {
            $in: [1, 2, 3]
        }
    });
    console.log(reslut);

})()
