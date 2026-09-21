import { userRole } from "./database.ts";
// 查询user_role表中user.id的平均值
const avg = await userRole.avg({
    field: "user.id",
    query: {
        "user.id": { $eq: { $col: "user_role.userId" } }
    } as any,
    joins: [
        {
            table: "system_user",
            type: "left",
            as: "user",
            on: { "user_role.userId": "user.id" }
        }
    ]
})

// 查询id为30的记录的平均值
const avgQuery = await userRole.avg({
    field: "id",
    query: {
        "id": { $eq: 30 }
    }
})

// 查询所有记录的平均值
const avgAll = await userRole.avg({
    field: "id",
})

console.log(avg)
console.log(avgQuery)
console.log(avgAll)