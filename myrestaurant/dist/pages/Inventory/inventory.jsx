import { __awaiter } from "tslib";
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
    return (<Container className={`inventory ${theme}`}>
            <Row className='title'>
                <h2>Inventory</h2>
            </Row>

            <Row className='actions'>
                <Button onClick={() => {
            setNewInventory(Object.assign({}, inventoryObj));
            setAddItem(!addItem);
        }}>Add Item +</Button>
            </Row>

            <InventoryCreateForm handleSubmit={handleSubmit} handleData={handleData} newInventory={newInventory} addItem={addItem} onHide={() => setAddItem(false)} theme={theme}/>

            <InventoryUpdateForm handleSubmit={handleSubmit} updateItem={updateItem} onHide={() => setUpdateItem(false)} handleData={handleData} updateInventory={updateInventory} theme={theme}/>

            <Row xs={1} md={2} lg={3}>
                {inventory.map((item, i) => {
            return (<Col key={`inventory-item-${i}`}>
                            <Card.Body onClick={() => {
                    setUpdateInventory(Object.assign(Object.assign({}, inventoryObj), item));
                    setUpdateItem(!updateItem);
                }}>
                                <Card.Title>{item.ingredient}</Card.Title>
                                <CoffeeBeans className="icon"/>
                                <div className='card-details'>
                                    <Card.Text>Available: {item.quantity}</Card.Text>
                                    <Card.Text>{`£ ${item.unit_price}`}</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>);
        })}
            </Row>

        </Container>);
}
export default Inventory;
