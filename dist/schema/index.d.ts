import { ResultSetHeader } from "mysql2/promise";
import { FieldConstraints, FieldSchema, DefineTpe } from "./fieldConstraints";
import { Query, AggregationOptions } from "../parse/operators";
import { QueryResult } from "mysql2/promise";
export declare enum DataType {
    Tinyint = "TINYINT",
    Smallint = "SMALLINT",
    Mediumint = "MEDIUMINT",
    Int = "INT",
    INTEGER = "INTEGER",
    Bigint = "BIGINT",
    Float = "FLOAT",
    Double = "DOUBLE",
    Decimal = "DECIMAL",
    Char = "CHAR",
    VarChar = "VARCHAR",
    TinyBlob = "TINYBLOB",
    TinyText = "TINYTEXT",
    Blob = "BLOB",
    Text = "TEXT",
    MediumBlob = "MEDIUMBLOB",
    MediumText = "MEDIUMTEXT",
    LongBlob = "LONGBLOB",
    LongText = "LONGTEXT",
    Json = "JSON",
    Date = "DATE",
    Time = "TIME",
    Year = "YEAR",
    DateTime = "DATETIME",
    Timestamp = "TIMESTAMP"
}
export declare class FieldSchemaBuilder {
    static Char(opt?: FieldConstraints): FieldSchema;
    static Char(length: number, opt?: FieldConstraints): FieldSchema;
    static VarChar(opt?: FieldConstraints): FieldSchema;
    static VarChar(length: number, opt?: FieldConstraints): FieldSchema;
    static Decimal(opt?: FieldConstraints): FieldSchema;
    static Decimal(m: number, opt?: FieldConstraints): FieldSchema;
    static Decimal(m: number, d: number, opt?: FieldConstraints): FieldSchema;
    static Float(opt?: FieldConstraints): FieldSchema;
    static Float(m: number, opt?: FieldConstraints): FieldSchema;
    static Float(m: number, d: number, opt?: FieldConstraints): FieldSchema;
    static Double(opt?: FieldConstraints): FieldSchema;
    static Double(m: number, opt?: FieldConstraints): FieldSchema;
    static Double(m: number, d: number, opt?: FieldConstraints): FieldSchema;
    static DateTime(opt?: FieldConstraints): FieldSchema;
    static DateTime(fps: number, opt?: FieldConstraints): FieldSchema;
    static Time(fpsOrOpt?: FieldConstraints): FieldSchema;
    static Time(fpsOrOpt: number, opt?: FieldConstraints): FieldSchema;
    static Timestamp(opt?: FieldConstraints): FieldSchema;
    static Timestamp(fps: number, opt?: FieldConstraints): FieldSchema;
    static Define(type: DefineTpe, opt?: FieldConstraints): FieldSchema;
}
type FieldsMap<T> = Record<keyof T, FieldSchema>;
type QueryResultItem<T> = T[] | T | QueryResult;
type SchemaHooks<T, P = any> = {
    beforeInsert?: (data: T) => Promise<T | void>;
    afterInsert?: (data: T) => Promise<ResultSetHeader>;
    beforeUpdate?: (query: Query<T>, data: Partial<T>) => Promise<[Query<T>, Partial<T>]>;
    afterUpdate?: (data: T) => Promise<ResultSetHeader | any | void>;
    beforeDelete?: (query: Query<T>) => Promise<Query<T>>;
    afterDelete?: (data: T) => Promise<ResultSetHeader>;
    beforeFind?: (query: Query<T>) => Promise<Query<T>>;
    afterFind?: (results: QueryResultItem<T>) => Promise<QueryResultItem<T>>;
    beforeAggregate?: (query: AggregationOptions<T>) => Promise<AggregationOptions<T>>;
    AFterAggregate?: (results: QueryResultItem<P>) => Promise<QueryResultItem<P>>;
};
export declare class Schema<T> {
    fields: FieldsMap<T>;
    fieldsMap: Map<string, DataType>;
    hooks: SchemaHooks<T>;
    table?: string;
    constructor(fields: FieldsMap<T>, hooks?: SchemaHooks<T>);
    toTableDefinition(): {
        definition: string;
        alterTable?: string | undefined;
    };
    parseFields(name: string, config: FieldSchema, uniqueGroupMap: Map<string, string[]>): {
        definition: string;
        alterTable?: string | undefined;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map