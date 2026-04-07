"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseOrder;
const ORDER_MAP = { 'asc': 'ASC', 'desc': 'DESC' };
const utils_1 = require("../utils");
function parseOrder(order) {
    const orderSql = [];
    for (const k in order) {
        const dir = order[k];
        if (dir == null)
            continue;
        orderSql.push(`${(0, utils_1.parseJson)(k)} ${ORDER_MAP[dir]}`);
    }
    if (orderSql.length === 0)
        return '';
    return `ORDER BY ${orderSql.join(', ')}`;
}
//# sourceMappingURL=parseOrder.js.map