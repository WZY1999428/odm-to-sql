import { userModel } from "./database.ts";

// 使用事务执行多个操作 - 确保所有操作要么全部成功，要么全部失败回滚
await userModel.withTransaction(async (executor) => {

    // executor.

    // 1. 在事务中插入第一条用户记录（name: "test", age: 18）
    await executor.insertOne({
        username: "test",
        nickname: "test",
        password: "test",
        email: "test@test.com",
        phone: "12345678901",
        enabled: 1,
        isSuperAdmin: 0
    });

    // 2. 在事务中插入第二条用户记录（name: "test2", age: 19）
    await executor.insertOne({
        username: "test2",
        nickname: "test2",
        password: "test2",
        email: "test2@test.com",
        phone: "12345678902",
        enabled: 1,
        isSuperAdmin: 0
    });

    // 3. 在事务中删除 name 为 "test" 的用户记录
    // 此操作会删除第一条插入的记录
    await executor.deleteOne({ username: "test" });

    // 事务自动提交 - 如果以上操作都成功，事务提交；如果任一操作失败，事务回滚
});