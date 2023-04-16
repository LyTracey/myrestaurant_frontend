export interface MenuObj {
    [index: string]: any,
    id?: number | null,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number | ""},
    image?: string | null,
    description: string,
    price: number | null,
    in_stock?: boolean,
    available_quantity?: number
};

export interface IngredientsObj {
    [index: number]: string
};