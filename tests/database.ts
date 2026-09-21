import { Schema, DataType } from "../src/schema/index.ts";
import MySqlODM from "../src/index.ts"
const odm = new MySqlODM();

type User = {
    id?: number,
    avatar?: string,
    username: string,
    nickname: string,
    password: string,
    email: string,
    phone: string,
    enabled: number,
    isSuperAdmin: number,
    createdAt?: string,
    updatedAt?: string,
}

type UserRole = {
    id?: number,
    userId: number,
    roleId: number,
    createdAt: string,
    updatedAt: string,
}

await odm.use({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "koa-serve"
}, "connection")




export const userModel = await odm.model<User>("system_user", new Schema<User>({
    id: { type: DataType.BigInt, primaryKey: true, autoIncrement: { start: 10000, enabled: true } },
    avatar: { type: DataType.VarChar, length: 255, nullable: true },
    username: { type: DataType.VarChar, length: 255, nullable: false, unique: true },
    nickname: { type: DataType.VarChar, length: 255, nullable: false },
    password: { type: DataType.VarChar, length: 255, nullable: false },
    email: { type: DataType.VarChar, length: 255, nullable: false, unique: true },
    phone: { type: DataType.VarChar, length: 50, nullable: false, unique: true },
    enabled: { type: DataType.Int, default: 1 },
    isSuperAdmin: { type: DataType.Int, default: 0 },
    createdAt: { type: DataType.DateTime, default: 'CURRENT_TIMESTAMP' },
    updatedAt: { type: DataType.DateTime, default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
}));


export const userRole = await odm.model<UserRole>("user_role", new Schema<UserRole>({
    id: { type: DataType.BigInt, primaryKey: true, autoIncrement: { start: 10000, enabled: true } },
    userId: { type: DataType.BigInt, nullable: false, uniqueGroup: ["user_role_unique"] },
    roleId: { type: DataType.BigInt, nullable: false, uniqueGroup: ["user_role_unique"] },
    createdAt: { type: DataType.DateTime, default: 'CURRENT_TIMESTAMP' },
    updatedAt: { type: DataType.DateTime, default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
}));

