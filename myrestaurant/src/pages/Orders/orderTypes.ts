export interface OrdersObj {
    id?: number | null,
    menu_items: Array<number>,
    quantity: {[key: string]: number | ""},
    notes: string,
    ordered_at: Date | null,
    prepared: boolean,
    prepared_at: Date | null,
    delivered: boolean,
    delivered_at: Date | null,
    complete: boolean
};

export interface MenuItemsObj {
   [key: number]: {
        title: string,
        available_quantity: number
    }
};