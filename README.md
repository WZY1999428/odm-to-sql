# MySQL DSL

> 🚀 **Like MongoDB, but for MySQL.**  
> 基于 `mysql2` 打造，像写 MongoDB / Mongoose 查询一样操作 MySQL。支持声明式 JSON 连表、自动聚合以及强类型 TypeScript 体验。

---

## 📖 项目简介

**MySQL DSL** 是一个专为 TypeScript / Node.js 开发者打造的声明式 SQL 查询构建工具，**原生基于 `mysql2` 驱动开发**。

它的设计初衷是将 **MongoDB 简单直观的 JSON 查询 API** 引入到 **MySQL 关系型数据库** 中。你不再需要手动拼接复杂的 `LEFT JOIN`、`GROUP BY` 或 `JSON_ARRAYAGG`，只需传入结构化的 JSON 对象，即可自动生成防注入的 SQL 并通过 `mysql2` 执行。

### ✨ 核心特性

- 🍃 **Mongo 风格 API**：原生支持 `$ne`、`$gt`、`$in`、`$like` 等操作符，上手零门槛。
- ⚡ **原生基于 `mysql2`**：完美兼容 `mysql2` 的 Promise 连接池（Pool）和连接对象，零额外包体积负担。
- 🔗 **声明式连表（Declarative Join）**：通过简洁的 JSON 配置直接搞定一对多、多对多的 `JOIN` 查询。
- 📦 **自动 JSON 聚合**：连表查询自动将子表记录聚合为 JSON 数组（`jsonArray`）或对象，无需手动清洗转换数据。
- 🛡️ **安全与类型保障**：基于 TypeScript，提供精准的字段类型补全，并通过 `mysql2` 参数化绑定彻底防护 SQL 注入。

---