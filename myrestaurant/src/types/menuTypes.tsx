export interface MenuObj {
    [index: string]: any,
    id?: number,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number},
    image?: string,
    description: string,
    price: number
};