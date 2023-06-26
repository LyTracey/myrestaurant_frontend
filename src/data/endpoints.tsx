interface Endpoint {
    [key: string]: string
};

const endpoints: Endpoint = {
    prefix: "https://tly.pythonanywhere.com/myrestaurant/",
    prefix_user: "https://tly.pythonanywhere.com/user/",
    dashboard: "dashboard/",
    menu: "menu/",
    inventory: "inventory/",
    orders: "orders/",
    archivedOrders: "archive/orders/",
    register: "register/",
    profile: "profile/",
    login: "login/",
    refresh: "token/refresh/",
    verify: "token/verify/"
};

export default endpoints;