import type { Query } from "./index.js";
export type When<V> = {
    when: Record<string, Query<V>>;
    then: any;
};
export type Else = string | number | null;
export declare enum CaseMode {
    JSON_ARRAYAGG = "JSON_ARRAYAGG",
    DEFAULT = "DEFAULT"
}
export type Case<V> = {
    $whens: When<V>[];
    $else?: Else;
    mode?: CaseMode;
};
//# sourceMappingURL=case.d.ts.map