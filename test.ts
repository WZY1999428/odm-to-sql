import { Schema, DataType, FieldSchemaBuilder } from "./src/schema";
import MySqlODM from "./src/index"
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


    const result = await user.aggregate({
        fields: ["id", "name"],
        specs: [{
            $sum: { field: "age", as: "totalAge", from: "user", where: { age: { $gt: 18 } } }
        }] as any,
        query: { age: { $gt: 18 } },
        group: ["id"],
        sort: { "id": "asc" },
        joins: [
            {
                table: "user",
                type: "self",
                as: "u2",
                on: { "user.id": "u2.id" }
            }
        ]
    })
    console.log(result)


})()