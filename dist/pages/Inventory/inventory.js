import { __awaiter } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ReactComponent as CoffeeBeans } from "../../images/icons/coffee-beans.svg";
import endpoints from "../../data/endpoints";
import InventoryCreateForm from "./inventoryCreateForm";
import InventoryUpdateForm from "./inventoryUpdateForm";
import slugify from "slugify";
import "../../styles/inventory.scss";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from "../Base/App";
;
function Inventory() {
    // Set states
    const inventoryObj = {
        id: null,
        ingredient: "",
        quantity: null,
        unit_price: null,
        image: null
    };
    const [inventory, setInventory] = useState([]);
    const [addItem, setAddItem] = useState(false);
    const [updateItem, setUpdateItem] = useState(false);
    const [newInventory, setNewInventory] = useState(inventoryObj);
    const [updateInventory, setUpdateInventory] = useState(inventoryObj);
    const theme = useContext(ThemeContext);
    // Get inventory
    const getInventory = () => {
        dataAPI.get(`${endpoints["inventory"]}`).then((response) => {
            setInventory(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch inventory on load
    useEffect(() => {
        getInventory();
    }, []);
    // Handle data
    const handleData = (item, value, method) => {
        method === "add" ? setNewInventory(Object.assign(Object.assign({}, newInventory), { [item]: value })) : setUpdateInventory(Object.assign(Object.assign({}, updateInventory), { [item]: value }));
    };
    // Handle submit
    const handleSubmit = (e, method, data) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        const itemPath = `${endpoints["inventory"]}${slugify((_a = String(data.id)) !== null && _a !== void 0 ? _a : "")}/`;
        switch (method) {
            case "delete":
                yield dataAPI.delete(itemPath).then(() => {
                    console.log(`Successfully deleted ${data.ingredient}`);
                    setUpdateItem(!updateItem);
                    getInventory();
                }).catch((error) => console.log(error));
                break;
            case "add":
                yield dataAPI.post(`${endpoints["inventory"]}`, {
                    ingredient: newInventory.ingredient,
                    quantity: newInventory.quantity,
                    unit_price: newInventory.unit_price,
                }).then(() => {
                    setAddItem(!addItem);
                    getInventory();
                }).catch((error) => {
                    console.log(error);
                });
                break;
            case "update":
                yield dataAPI.patch(itemPath, {
                    ingredient: updateInventory.ingredient,
                    quantity: updateInventory.quantity,
                    unit_price: updateInventory.unit_price,
                }).then(() => {
                    setUpdateItem(!updateItem);
                    getInventory();
                }).catch((error) => {
                    console.log(error);
                });
                break;
            default:
                console.log("Unrecognised method");
        }
    });
    return (_jsxs(Container, Object.assign({ className: `inventory ${theme}` }, { children: [_jsx(Row, Object.assign({ className: 'title' }, { children: _jsx("h2", { children: "Inventory" }) })), _jsx(Row, Object.assign({ className: 'actions' }, { children: _jsx(Button, Object.assign({ onClick: () => {
                        setNewInventory(Object.assign({}, inventoryObj));
                        setAddItem(!addItem);
                    } }, { children: "Add Item +" })) })), _jsx(InventoryCreateForm, { handleSubmit: handleSubmit, handleData: handleData, newInventory: newInventory, addItem: addItem, onHide: () => setAddItem(false), theme: theme }), _jsx(InventoryUpdateForm, { handleSubmit: handleSubmit, updateItem: updateItem, onHide: () => setUpdateItem(false), handleData: handleData, updateInventory: updateInventory, theme: theme }), _jsx(Row, Object.assign({ xs: 1, md: 2, lg: 3 }, { children: inventory.map((item, i) => {
                    return (_jsx(Col, { children: _jsxs(Card.Body, Object.assign({ onClick: () => {
                                setUpdateInventory(Object.assign(Object.assign({}, inventoryObj), item));
                                setUpdateItem(!updateItem);
                            } }, { children: [_jsx(Card.Title, { children: item.ingredient }), _jsx(CoffeeBeans, { className: "icon" }), _jsxs("div", Object.assign({ className: 'card-details' }, { children: [_jsxs(Card.Text, { children: ["Available: ", item.quantity] }), _jsx(Card.Text, { children: `£ ${item.unit_price}` })] }))] })) }, `inventory-item-${i}`));
                }) }))] })));
}
export default Inventory;
