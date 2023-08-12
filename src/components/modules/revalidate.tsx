import { internalEndpoints } from "../../data/endpoints";

export const SHOULD_REVALIDATE_PROFILE = [
    internalEndpoints.profile
];

export const SHOULD_REVALIDATE_MENU = [
    internalEndpoints.menu,
    internalEndpoints.menuCreate,
    internalEndpoints.menuUpdate
];

export const SHOULD_REVALIDATE_INVENTORY = [
    internalEndpoints.inventory,
    internalEndpoints.inventoryCreate,
    internalEndpoints.inventoryUpdate
];

export const SHOULD_REVALIDATE_ORDERS = [
    internalEndpoints.orders,
    internalEndpoints.ordersCreate,
    internalEndpoints.ordersUpdate,
    internalEndpoints.ordersArchive
];

export const SHOULD_REVALIDATE_DASHBOARD = [
    internalEndpoints.dashboard
];