interface Endpoint {
    prefix: string,
    [key: string]: string
};

const endpoints: Endpoint = {
    prefix: "http://127.0.0.1:8000/myrestaurant/",
    dashboard: "dashboard/",
    menu: "menu/",
    inventory: "inventory/",
};

export default endpoints;