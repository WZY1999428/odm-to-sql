import { DataType } from ".";
export type FieldConstraints = {
    required?: boolean | undefined;
    primary?: boolean | undefined;
    autoIncrement?: boolean | undefined;
    nullable?: boolean | undefined;
    index?: boolean | undefined;
    unique?: boolean | undefined;
    uniqueGroup?: string[] | undefined;
};
export type NumericSchema = FieldConstraints & {
    type: DataType.Decimal | DataType.Float | DataType.Double;
    m: number;
    d: number;
};
export type StringSchema = FieldConstraints & {
    type: DataType.Char | DataType.VarChar;
    length: number;
};
export type DateTimeSchema = FieldConstraints & {
    type: DataType.DateTime | DataType.Time | DataType.Timestamp;
    fps?: number;
};
export type OtherSchema = FieldConstraints & {
    type: Exclude<DataType, DataType.Char | DataType.VarChar | DataType.Decimal | DataType.Float | DataType.Double | DataType.DateTime | DataType.Time | DataType.Timestamp>;
};
export type FieldSchema = NumericSchema | StringSchema | DateTimeSchema | OtherSchema;
export type SpecializedTypes = DataType.Char | DataType.VarChar | DataType.DateTime | DataType.Time | DataType.Timestamp | DataType.Decimal | DataType.Float | DataType.Double;
export type DefineTpe = Exclude<DataType, SpecializedTypes>;
//# sourceMappingURL=fieldConstraints.d.ts.map