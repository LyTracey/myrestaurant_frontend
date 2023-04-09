export interface MenuObj {
    [index: string]: any,
    id?: number | null,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number | ""},
    image?: string,
    description: string,
    price: number | null
};

export interface IngredientsObj {
    [index: number]: string
};