
import { userRole } from "./database.ts";

const result = await userRole.aggregate({
    fields: ["user.id", "user.username"],
    specs: [
        {
            $count: { field: "id", as: "count", from: "system_user", where: { "user.id": { $eq: { $col: "user_role.userId" } } } }
        }
    ] as any,
    query: {
        "user_role.id": { $eq: 10004 }
    } as any,
    group: ["user.id"] as any,
    sort: { "user.id": "asc" },
    joins: [
        {
            table: "system_user",
            type: "inner",
            as: "user",
            on: { "user_role.userId": "user.id" }
        }
    ]
})



