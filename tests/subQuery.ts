import { Query } from "../src/parse/operators/index.ts";
import { userModel } from "./database.ts";

type User = {
    id: number;
    name: string;
    val: string;
}

const taks = [
    // 查询用户id为10000 等于xxx 时可以简写
    // userModel.findOne({
    //     name: {
    //         $select: {
    //             table: "user",
    //             fields: ["name"],
    //             query: {
    //                 id: 10000,
    //                 val: {
    //                     $select: {
    //                         table: "user",
    //                         fields: ["val"],
    //                         query: {
    //                             id: 10000,
    //                             name: {
    //                                 $eq: "test",
    //                                 $nlike: "%test%"
    //                             }
    //                         } as Query<User>
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }),
    userModel.findOne({ id: 10005 }, {
        fields: [{
            title: {
                type: "jsonArray",
                table: "dict_items",
                fields: ["title", "id", "value"],
                query: {
                    id: {
                        $lt: 10029
                    }
                },
            },
        }]
    }),

    // userModel.aggregate({
    //     query: { id: 10000 },
    //     fields: ["username", {
    //         nickname: {
    //             table: "user",
    //             fields: ["nickname"],
    //             query: {
    //                 id: 10000
    //             },
    //             limit: 1,
    //             offset: 20
    //         },
    //     }]
    // }),
    // 查询用户id为100 

]

const results = await Promise.all(taks)
console.log(JSON.stringify(results, null, 2));
