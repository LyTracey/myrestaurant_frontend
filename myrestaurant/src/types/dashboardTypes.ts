export interface Sales {
    [key: string]: number
}

export interface Statistics {
    low_stock: Array<string>,
    out_of_stock: Array<string>,
    sales: Sales,
    revenue?: number,
    profit?: number
}