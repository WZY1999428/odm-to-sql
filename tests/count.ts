import { userRole } from "./database.ts";
// 查询user_role表中user.id的数量
const total = await userRole.count({
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


// 查询id为123的记录的数量
const totalQuery = await userRole.count({
    field: "id",
    query: {
        "id": { $eq: "123" }
    }
})

// 查询所有记录的数量
const total2 = await userRole.count({
    field: "id",
})

console.log(total)
console.log(totalQuery)
console.log(total2)