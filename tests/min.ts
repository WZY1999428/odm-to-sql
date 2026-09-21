import { userRole } from "./database.ts";
// 查询user_role表中user.id的最小值


const total = await userRole.min({
    field: "user.id",
    query: {
        "user.id": { $eq: { $col: "user_role.userId" } }
    } as any,

    // 不支持 使用 select选项
    joins: [
        {
            table: "system_user",
            type: "left",
            as: "user",
            on: { "user_role.userId": "user.id" }
        }
    ]
})

// 查询id为30的记录的最小值
const totalQuery = await userRole.min({
    field: "id",
    query: {
        "id": { $lt: 10005 }
    }
})


// 查询所有记录的最小值
const total2 = await userRole.min({
    field: "id",
})

console.log(total)
console.log(totalQuery)
console.log(total2)