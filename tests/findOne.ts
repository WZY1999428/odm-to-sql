import { userModel } from "./database.ts";

const taks = [
    // 查询用户id为100
    userModel.findOne({ id: { $eq: 10000 } }),
    // 查询id小于20000的用户
    userModel.findOne({ id: { $lt: 20000 } }),
    //  查询 日期范围
    userModel.findOne({ createdAt: { $between: ["2025-01-01 00:00:00", "2025-12-31 23:59:59"] } }),
    userModel.findOne({ updatedAt: { $exists: true } }),
    // 查询姓名包含"张"的用户
    userModel.findOne({ name: { $like: "%张%" } }),
    // 查询日期范围
    userModel.findOne({ createdAt: { $gte: "2025-01-01 00:00:00" } }),

    // 查询json
    userModel.findOne({ object: { $json: { "objext.a.v": { $eq: 30 } } } })

]

const results = await Promise.all(taks)
console.log(results);