interface Endpoint {
    [key: string]: string
};


// External endpoints
export const externalEndpoints: Endpoint = {
    // prefix: "https://tly.pythonanywhere.com/myrestaurant/",
    // prefix_user: "https://tly.pythonanywhere.com/user/",
    prefix_data: "http://127.0.0.1:8000/myrestaurant/",
    prefix_user: "http://127.0.0.1:8000/user/",
    dashboard: "dashboard/",
    dashboardStock: "dashboard-stock/",
    menu: "menu/",
    inventory: "inventory/",
    inventoryReference: "inventory-reference/",
    orders: "orders/",
    archivedOrders: "archive/orders/",
    register: "register/",
    profile: "profile/",
    login: "login/",
    refresh: "token/refresh/",
};


export const internalEndpoints: Endpoint = {
    home: "/",
    dashboard: "/dashboard",
    menu: "/menu",
    menuCreate: "/menu/create",
    menuUpdateRoot: "/menu/update",
    menuUpdate: "/menu/update/:id",
    inventory: "/inventory",
    inventoryCreate: "/inventory/create",
    inventoryUpdateRoot: "/inventory/update",
    inventoryUpdate: "/inventory/update/:id",
    orders: "/orders",
    ordersCreate: "/orders/create",
    ordersUpdateRoot: "/orders/update",
    ordersUpdate: "/orders/update/:id",
    ordersArchive: "/orders/archive",
    register: "/register",
    profile: "/profile",
    login: "/login",
    logout: "/logout",
    refresh: "/token/refresh",
    verify: "/token/verify"
};