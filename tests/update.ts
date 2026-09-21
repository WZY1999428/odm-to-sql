import { userModel } from "./database.ts";

// 更新一个
const tasks = [
    // 更新用户id为100的用户
    userModel.updateOne({ id: 100 }, { username: "new_username" }),
    // 更新用户id为101的用户
    userModel.updateOne({ id: { $eq: 101 } }, { password: "password" }),
    // 使用$in 也只会更新第一个
    userModel.updateOne({ id: { $in: [101, 200, 3000] } }, { password: "password" })
]

await Promise.all(tasks)
