import { userRole } from "./database.ts";
// 查询user_role表中user.id的总和

const total = await userRole.sum({
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

// 查询id为30的记录的总和
const totalQuery = await userRole.sum({
    field: "id",
    query: {
        "id": { $lt: 10005 }
    }
})


// 查询所有记录的总和
const total2 = await userRole.sum({
    field: "id",
})

console.log(total)
console.log(totalQuery)
console.log(total2)