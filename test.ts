// import { Schema, DataType, FieldSchemaBuilder } from "./src/schema";
// import MySqlODM from "./src/index"
// // import parseUpdate from "./src/parse/parseUpdate"
// const odm = new MySqlODM();

// type User = {
//     id?: number,
//     name: string,
//     email: string,
//     age: number,
//     aaaa: number,
//     json: any
// }

// (async () => {
//     await odm.use({
//         host: "localhost",
//         user: "root",
//         password: "123456789",
//         database: "1111"
//     }, "connection")

//     const user = odm.model<User>("user", new Schema<User>({
//         id: FieldSchemaBuilder.Define(DataType.Int, { primary: true, autoIncrement: true }),
//         name: FieldSchemaBuilder.VarChar(),
//         email: FieldSchemaBuilder.VarChar(),
//         age: FieldSchemaBuilder.Define(DataType.Int),
//         aaaa: FieldSchemaBuilder.Define(DataType.Int, { nullable: true }),
//         json: FieldSchemaBuilder.Define(DataType.Json)
//     }));

//     // const datas: User[] = [];
//     // for (let i = 0; i < 1000; i++) {
//     //     datas.push({
//     //         name: `name-${i}`,
//     //         email: `email-${i}`,
//     //         age: i,
//     //         aaaa: i,
//     //         json: { a: 1, b: 2 }
//     //     })
//     // }
//     // await user.insertMany(datas);
//     // const reslut = await user.deleteOne({ id: 1 })
//     const reslut = await user.count({
//         age: {
//             $in: [1, 2, 3]
//         }
//     });
//     console.log(reslut);

// })()
import { parseObjectKeys } from "./src/utils/index";
import parseQuery from "./src/parse/parseQuery"

// 模拟 1000 次不同结构的请求
const testCases: any = [
    // Case A: 基础路径
    { "user.id": 1, "status": "active" },

    // Case B: 顺序打乱 (测试你的指纹是否支持 sort)
    { "status": "active", "user.id": 2 },

    // Case C: 深度嵌套 (测试 BFS 队列是否会粘连)
    { "id": { $gt: 10 } },

    // Case D: 操作符差异 (测试指纹是否包含操作符名)
    { "id": { $in: [1, 2] } },
    // Case E: 极端边界 (测试 Key 拼接是否有分隔符)
    { "userid": 1 },
];

console.time("Performance");
const cache = new Map();

for (let i = 0; i < 10000000; i++) {
    const data = testCases[i % testCases.length];

    // 1. 生成指纹
    const fingerprint = parseObjectKeys(data);
    // 2. 命中缓存或生成 SQL
    if (!cache.has(fingerprint)) {
        cache.set(fingerprint, parseQuery(data));
    }
}
console.timeEnd("Performance");
console.log("生成的指纹总数:", cache.size);