
export const UpdateAtomicMap = {
    $inc: "",
    $mul: "",
    $max: "",
    $min: "",
    $concat: "",
} as const
export type UpdateAtomic = keyof typeof UpdateAtomicMap;