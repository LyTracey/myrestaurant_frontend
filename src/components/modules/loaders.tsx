import { dataAPI, userAPI } from "../App";
import axios from "axios";
import { externalEndpoints } from "../../data/endpoints";

export const MenuLoader = async () => {
    const [menuResponse, inventoryResponse] = await axios.all([
        dataAPI.get(`${externalEndpoints["menu"]}`),
        dataAPI.get(`${externalEndpoints["inventory"]}`)
    ]);
    return [menuResponse?.data, inventoryResponse?.data]
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
    const inventoryResponse = await dataAPI.get(`${externalEndpoints["inventory"]}`);
    return inventoryResponse.data
};


export const UserLoader = async () => {
    console.log("in profile loader");

    const response = await userAPI.get(`${ externalEndpoints["profile"] }${ sessionStorage.getItem("username") }/`)
    return {
        username: response.data?.username,
        isStaff: response?.data.is_staff,
        joinDate: response?.data.join_date,
        role: response?.data.role
    }
};
