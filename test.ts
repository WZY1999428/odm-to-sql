import { Schema, DataType, FieldSchemaBuilder } from "./src/schema";
import MySqlODM from "./src/index"
const odm = new MySqlODM();

type Route = {
    id: number;
    parentId: number;
    title: string;
    type: number;
    icon: string;
    path: string;
    component: string;
    sort: number;
    isLink: number;
    enabled: number;
    createdAt: string;
    updatedAt: string;
}

(async () => {
    await odm.use({
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "koa-serve"
    }, "connection")


    const routeSchema = new Schema<Route>({
        id: { type: DataType.BigInt, primaryKey: true, autoIncrement: { start: 10000, enabled: true } },
        parentId: { type: DataType.BigInt, default: 0 },
        title: { type: DataType.VarChar, length: 255, nullable: false },
        type: { type: DataType.Int, default: 1, nullable: false },
        icon: { type: DataType.VarChar, length: 255, nullable: true },
        path: { type: DataType.VarChar, length: 255, nullable: true },
        component: { type: DataType.VarChar, length: 255, nullable: true },
        sort: { type: DataType.Int, default: 0, nullable: false },
        isLink: { type: DataType.Int, default: 1 },
        enabled: { type: DataType.Int, default: 1 },
        createdAt: { type: DataType.DateTime, default: 'CURRENT_TIMESTAMP' },
        updatedAt: { type: DataType.DateTime, default: 'CURRENT_TIMESTAMP' },
    });

    const routeModel = await odm.model('menus', routeSchema);

    const result = await routeModel.aggregate({
        query: {},
        fields: [
            "menus.id",
            "menus.parentId",
            "menus.title",
            "menus.type",
            "menus.icon",
            "menus.path",
            "menus.component",
            "menus.sort",
            "menus.isLink",
            "menus.enabled",
        ],
        jsonArrayAgg: [
            {
                as: "buttons",
                fields: {
                    "id": "menuButtons.id",
                    "name": "menuButtons.name",
                    "sort": "menuButtons.sort",
                    "enabled": "menuButtons.enabled",
                },
                case: {
                    $whens: [
                        { when: { "menuButtons.id": { $ne: null } } } as any
                    ],
                }
            }
        ],
        joins: [{
            table: "menu_buttons",
            type: "left",
            as: "menuButtons",
            on: { "menuButtons.menuId": "menus.id" }

        }],
        group: ["menus.id"],
        limit: 10,
        offset: 0
    })

    // console.log(JSON.stringify(result, null, 2))

})()
