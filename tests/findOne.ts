import { userModel, songModel, songArtistModel, artistModel } from "./database.ts";

const taks = [
    // 查询用户id为10000 等于xxx 时可以简写
    // userModel.findOne({ id: 10000 }),
    // // 查询用户id为100 
    // userModel.findOne({ id: { $eq: 10000 } }),
    // // 查询id小于20000的用户
    // userModel.findOne({ id: { $lt: 20000 } }),
    // //  查询 日期范围
    // userModel.findOne({ createdAt: { $between: ["2025-01-01 00:00:00", "2025-12-31 23:59:59"] } }),
    // // 查询姓名包含"张"的用户
    // userModel.findOne({ name: { $like: "%张%" } }),
    // // 查询日期范围
    // userModel.findOne({ createdAt: { $gte: "2025-01-01 00:00:00" } }),

    // // 查询json
    // userModel.findOne({ $json: { "objext.a.v": { $eq: 30 } } }),
    // userModel.findOne({
    //     id: {
    //         $select: {
    //             table: "system_user",
    //             fields: ["id"],
    //             joins: [
    //                 {
    //                     table: "user",
    //                     as: "user",
    //                     type: "inner",
    //                     on: {
    //                         id: "system_user.id"
    //                     }
    //                 }
    //             ],
    //             query: {
    //                 id: 10000
    //             }
    //         }
    //     }
    // })
    songModel.aggregate({
        fields: songModel.qualifyFields(["id", "title", "cover"]),
        query: {
            id: {
                $in: [
                    {
                        table: "music_song_artist",
                        fields: ["songId"],
                        joins: [
                            {
                                table: "music_song_artist",
                                as: "artist",
                                type: "inner",
                                on: {
                                    id: "artist.artist_id"
                                }
                            }

                        ],
                        query: {
                            title: {$like:"%周杰伦%"}
                        }
                    }
                ]
            }
        },
        joins:[
            {
                table: "music_artist",
                as: "artist",
                type: "inner",
                on: {
                    id: "artist.id"
                }
            }
        ]
    })
]

const results = await Promise.all(taks)
console.log(results);