export type OrderBy<T> = Partial<Record<keyof T | string, 'asc' | 'desc'>>;
export default function parseOrder<T>(order: OrderBy<T>): string;
//# sourceMappingURL=parseOrder.d.ts.map