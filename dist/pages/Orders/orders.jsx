import { __awaiter } from "tslib";
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import OrdersCreateForm from './ordersCreateForm';
import OrderUpdateForm from "./ordersUpdateForm";
import slugify from 'slugify';
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
import { errorFormatter } from '../../utils/formatter';
function Orders() {
    const ordersObj = {
        id: null,
        menu_items: [],
        quantity: {},
        notes: "",
        ordered_at: null,
        prepared: false,
        prepared_at: null,
        delivered: false,
        delivered_at: null,
        complete: false
    };
    // Set states
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState({});
    const [newOrder, setNewOrder] = useState(ordersObj);
    const [addItem, setAddItem] = useState(false);
    const [updateOrder, setUpdateOrder] = useState(ordersObj);
    const [updateItem, setUpdateItem] = useState(false);
    const [feedback, setFeedback] = useState([]);
    // Set contexts
    const theme = useContext(ThemeContext);
    // Set variables
    const entries = Object.entries(menu).map((item) => [item[0], item[1].available_quantity]);
    const availabilities = Object.fromEntries(entries);
    // Fetch menu data from backend
    const getOrders = () => {
        dataAPI.get(`${endpoints["orders"]}`).then((response) => {
            setOrders(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    const getMenu = () => {
        dataAPI.get(`${endpoints["menu"]}`).then((response) => {
            const filteredMenu = {};
            response.data.forEach((item) => {
                if (item.available_quantity > 0) {
                    filteredMenu[item.id] = { title: item.title, available_quantity: item.available_quantity };
                }
            });
            setMenu(filteredMenu);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch menu data and ingredients data on first load
    useEffect(() => {
        getOrders();
        getMenu();
    }, []);
    // Fetch menu when adding or updating forms
    useEffect(() => {
        if (addItem || updateItem) {
            getMenu();
        }
    }, [addItem, updateItem]);
    // Update newOrder || updateOrder state
    const handleData = (item, value, method) => {
        method === "add" ? setNewOrder(Object.assign(Object.assign({}, newOrder), { [item]: value })) : setUpdateOrder(Object.assign(Object.assign({}, updateOrder), { [item]: value }));
    };
    // Handle submit multipart form to backend
    const handleSubmit = (e, method, data) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const itemPath = `${endpoints["orders"]}${slugify(String(data.id))}/`;
        switch (method) {
            case "delete":
                yield dataAPI.delete(itemPath).then(() => {
                    console.log(`Successfully deleted order number ${data.id}`);
                    setUpdateItem(false);
                    getOrders();
                }).catch((error) => console.log(error));
                break;
            case "add":
                yield dataAPI.post(`${endpoints["orders"]}`, {
                    notes: newOrder.notes,
                    "menu_items[]": newOrder.menu_items,
                    "quantity{}": newOrder.quantity
                }).then(() => {
                    console.log(`Successfully added order number ${data.id}`);
                    setAddItem(false);
                    getOrders();
                }).catch((error) => {
                    console.log(error);
                });
                break;
            case "update":
                yield dataAPI.patch(itemPath, {
                    notes: updateOrder.notes,
                    "menu_items[]": updateOrder.menu_items,
                    "quantity{}": updateOrder.quantity
                }).then(() => {
                    setUpdateItem(false);
                    getOrders();
                }).catch((error) => {
                    console.log(error);
                });
                break;
            default:
                console.log("Unrecognised method");
        }
    });
    // Send PATCH request every time an order is prepared, delivered, or completed
    const handleCheck = (e, id, field, index) => {
        var _a, _b, _c;
        e.preventDefault();
        // Rest feedback
        setFeedback([]);
        // Check if checkboxes are ticked in the order prepared > delivered > complete
        if (field === "delivered" && !((_a = orders[index]) === null || _a === void 0 ? void 0 : _a.prepared)) {
            setFeedback(["Please ensure order is prepared."]);
            return;
        }
        else if (field === "complete" && (!((_b = orders[index]) === null || _b === void 0 ? void 0 : _b.prepared) || !((_c = orders[index]) === null || _c === void 0 ? void 0 : _c.delivered))) {
            setFeedback(["Please ensure order is prepared and delivered."]);
            return;
        }
        // Send patch request if the correct checkboxes are checked
        const itemPath = `${endpoints["orders"]}${slugify(String(id))}/`;
        dataAPI.patch(itemPath, {
            [field]: e.target.checked
        }).then(() => getOrders())
            .catch((error) => {
            setFeedback(errorFormatter(error));
        });
    };
    return (<Container className={`orders ${theme}`}>

            <Row className='title'>
                <h2>Orders</h2>
            </Row>
            
            <Row xs={2} className='actions'>
                <Button className="add" onClick={() => {
            setNewOrder(Object.assign({}, ordersObj));
            setAddItem(!addItem);
        }}>Add Item +</Button>
                <Button className="archive" as="a" href="/orders/archive">Archive</Button>
            </Row>

            <OrdersCreateForm addItem={addItem} onHide={() => setAddItem(false)} newOrder={newOrder} setNewOrder={setNewOrder} menu={menu} handleSubmit={handleSubmit} handleData={handleData} theme={theme} availabilities={availabilities}/>

            <OrderUpdateForm updateItem={updateItem} onHide={() => { setUpdateItem(false); }} updateOrder={updateOrder} setUpdateOrder={setUpdateOrder} menu={menu} handleSubmit={handleSubmit} handleData={handleData} theme={theme} availabilities={availabilities}/>

            <Row as="ul" className="feedback">
                {feedback.map((message, i) => <li key={i}>{message}</li>)}
            </Row>

            <Table responsive>
                <thead>
                    <tr className='headers'>
                        <th>Order ID</th>
                        <th>Menu Items</th>
                        <th>Notes</th>
                        <th>Ordered At</th>
                        <th>Prepared</th>
                        <th>Prepared At</th>
                        <th>Delivered</th>
                        <th>Delivered At</th>
                        <th>Complete</th>
                    </tr>
                </thead>
                <tbody>

                    {orders.map((item, i) => {
            return (<tr className="rows" onClick={() => {
                    var _a;
                    setUpdateOrder((_a = Object.assign({}, item)) !== null && _a !== void 0 ? _a : Object.assign({}, ordersObj));
                    setUpdateItem(!updateItem);
                }} key={i}>
                                    <td className='id'>{item.id}</td>
                                    <td className='menu-items'>{item.menu_items.map((item2, i) => {
                    var _a;
                    return (<p key={i}>{(_a = menu[item2]) === null || _a === void 0 ? void 0 : _a["title"]}</p>);
                })}</td>
                                    <td className='notes'>{item.notes}</td>
                                    <td className='ordered-at'>{String(item.ordered_at)}</td>
                                    <td className='prepared-at-check'><Form.Check onChange={(e) => handleCheck(e, item.id, "prepared", i)} onClick={e => e.stopPropagation()} checked={item.prepared}/></td>
                                    <td className='prepared-at'>{String(item.prepared_at)}</td>
                                    <td className='delivered-at-check'><Form.Check onChange={(e) => handleCheck(e, item.id, "delivered", i)} onClick={e => e.stopPropagation()} checked={item.delivered}/></td>
                                    <td className='delivered-at'>{String(item.delivered_at)}</td>
                                    <td className='complete-check'><Form.Check onChange={(e) => handleCheck(e, item.id, "complete", i)} onClick={e => e.stopPropagation()} checked={item.complete}/></td>
                                </tr>);
        })}
                </tbody>
            </Table>




        </Container>);
}
;
export default Orders;
