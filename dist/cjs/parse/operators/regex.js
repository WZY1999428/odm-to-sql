"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsRegexToMySQL;
function jsRegexToMySQL(jsRegex) {
    let s = jsRegex.source;
    // 1. 替换常用快捷字符
    s = s.replace(/\\d/g, '[0-9]');
    s = s.replace(/\\w/g, '[A-Za-z0-9_]');
    s = s.replace(/\\s/g, '[ \\t\\r\\n]');
    // 2. 去掉非捕获分组 (?:)
    s = s.replace(/\(\?:/g, '(');
    // 3. 警告零宽断言 (MySQL 不支持)
    if (/\(\?=|\(\?!|\(\?<=|\(\?<!/.test(s)) {
        throw new Error("MySQL REGEXP 不支持零宽断言 (lookahead/lookbehind)");
    }
    // 4. 保留 ^ 和 $ 锚点
    // 5. 其他字符保持原样（如 . * + ? {} [] ()）
    return s;
}
//# sourceMappingURL=regex.js.map