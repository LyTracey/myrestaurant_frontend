import { dataAPI, userAPI } from "./axiosInstances";
import axios from "axios";
import { externalEndpoints } from "../../data/endpoints";
import jwtDecode from "jwt-decode";

export const MenuLoader = async () => {
    const [menuResponse, inventoryResponse] = await axios.all([
        dataAPI.get(`${ externalEndpoints.menu! }`),
        dataAPI.get(`${ externalEndpoints.inventoryReference! }`)
    ]);

    const inventoryReference = Object.fromEntries(inventoryResponse?.data.map((item: {[key: string]: any}) => 
        [item.id, item.ingredient]
    ));

    return [menuResponse?.data, inventoryReference]
};

export const OrdersLoader = async () => {
    const [ordersResponse, menuResponse] = await axios.all([
        dataAPI.get(`${externalEndpoints["orders"]}`),
        dataAPI.get( `${externalEndpoints["menu"]}`)
    ]);

    return [ordersResponse?.data, menuResponse?.data]
};

export const OrdersArchiveLoader = async () => {
    const [archivedOrdersResponse, menuResponse] = await axios.all([
        dataAPI.get(`${externalEndpoints["archivedOrders"]}`),
        dataAPI.get( `${externalEndpoints["menu"]}`)
    ]);

    return [archivedOrdersResponse?.data, menuResponse?.data]
};

export const InventoryLoader = async () => {
    const [inventoryResponse, dashboardStockResponse] = await axios.all([
        dataAPI.get(`${externalEndpoints.inventory!}`),
        dataAPI.get(`${externalEndpoints.dashboardStock! }`)
    ]);
    return [inventoryResponse?.data, dashboardStockResponse?.data]
};


export const UserLoader = async () => {
    const { username }: any = jwtDecode(localStorage.getItem("access")!);
    const response = await userAPI.get(`${ externalEndpoints["profile"] }${ username }/`);

    // Set role and isStaff in local storage
    localStorage.setItem("role", response?.data.role);
    localStorage.setItem("isStaff", response?.data.is_staff);

    return {
        username: response.data?.username,
        isStaff: response?.data.is_staff,
        joinDate: response?.data.join_date,
        role: response?.data.role
    }
};
