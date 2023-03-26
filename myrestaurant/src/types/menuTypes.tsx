export interface MenuObj {
    id?: number,
    title: string | null,
    ingredients: {[key: string]: number},
    image?: string,
    description: string,
    price: number
};