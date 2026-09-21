
import { userRole } from "./database.ts";


// 普通查询
const result = await userRole.aggregate({
    // 需要显示的字段
    fields: ["id", "userId"],
    // 查询条件
    query: { "id": { $eq: 10004 } } as any,
    // 排序方式
    sort: { "id": "asc" },

})

console.log("result", result);

// 连表查询 
const joinsResult = await userRole.aggregate({
    // 需要显示的字段
    fields: ["user.id"],
    // 查询条件
    query: {
        "user_role.id": { $eq: 10004 }
    },
    // 分组
    group: ["user.id"] as any,
    // 排序方式
    sort: { "user.id": "asc" },
    joins: [
        {
            // 连接的表
            table: "system_user",
            // 连接类型 inner self left right   
            type: "inner",
            // 连接后的别名  不传 t1 t2 t3 依次累加
            as: "user",
            // 连接条件
            on: { "user_role.userId": "user.id" },
            // 连接后的字段  jsonArray count raw

        /**
         * type含义拼接生成的 SQL 示例最终输出结果格式
         * jsonArray一对多/多对多聚合数组IF(COUNT(r.id)=0, JSON_ARRAY(), JSON_ARRAYAGG(...))roles: [{ id: 1, name: 'admin' }]
         * count统计关联行数COUNT(r.id) AS roleCountroleCount: 3
         * raw传统连表打平查字段r.name AS roleNameroleName: "管理员"
         */
            select: [
                {
                    "type": "jsonArray",
                    "as": "user",
                    "fields": {
                        "id": "user.id",
                        "username": "user.username"
                    }
                },
                {
                    "type": "count",
                    "as": "userCount",
                    "fields": {
                        "id": "user.id"
                    }
                },
                {
                    "type": "raw",
                    "as": "userRaw",
                    "fields": {
                        "id": "user.id",
                        "username": "user.username"
                    }
                }
            ]
        }
    ]
})



console.log(JSON.stringify(joinsResult, null, 2));
