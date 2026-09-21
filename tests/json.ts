import { userModel } from "./database.ts";



const result = await userModel.findOne({
    $json: {
        "object.a.v": { $eq: 30 },
        "object.b.v": { $eq: 30 },
        "object.c.v": { $eq: 30 },
        "object.d.v": { $eq: 30 },
    },
    $or: [
        {
            $json: { "object.a.v": { $eq: 30 } }
        },
        {
            $json: { "object.a.v": { $eq: 30 } },
        },
        {
            $json: { "object.a.v": { $eq: 30 } },
        }
    ]
})
console.log(result)
