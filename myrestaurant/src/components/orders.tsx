import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import { OrdersObj, MenuItemsObj } from '../types/orderTypes';
import "../style/orders.scss";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import OrdersForm from './forms/ordersForm';
import OrderUpdateForm from './forms/ordersUpdateForm';
import slugify from 'slugify';

function Orders ( props: any ) {

    // Set states
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

    const [orders, setOrders] = useState<Array<OrdersObj>>([]);
    const [menu, setMenu] = useState<MenuItemsObj>({});
    const [newOrder, setNewOrder] = useState<OrdersObj>(ordersObj);
    const [addItem, setAddItem] = useState<boolean>(false);
    const [updateOrder, setUpdateOrder] = useState<OrdersObj>(ordersObj);
    const [updateItem, setUpdateItem] = useState<boolean>(false);
        
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    // Fetch menu data from backend
    const getOrders = () => {
        axios.get(
            `${endpoints.prefix}${endpoints["orders"]}`
        ).then(response => {
            setOrders(response.data);
        }).catch(error => {
            console.log(error);
        })
    };
    
    // Fetch ingredients from backend
    const getMenu = () => {
        axios.get(
            `${endpoints.prefix}${endpoints["menu"]}`
        ).then(response => {
            const filteredMenu: MenuItemsObj = {};
            response.data.forEach((item: any) => {
                if (item.in_stock) {
                    filteredMenu[item.id] = {title: item.title, available_quantity: item.available_quantity}
                }
            });
            setMenu(filteredMenu);
        }).catch(error => {
            console.log(error);
        })
    };

    // Fetch menu data and ingredients data on first load
    useEffect(() => {
        getOrders();
        getMenu();
    }, []);

    useEffect(() => getMenu(), [addItem, updateItem]);

    // Update newOrder | updateOrder state
    const handleData = (item: string, value: string | number, method: "add" | "update") => {
        method === "add" ? setNewOrder({...newOrder, [item]: value}) : setUpdateOrder({...updateOrder, [item]: value})
    };

    // Update newMenu units and ingredients state
    const handleQuantity = (item: string, checked: boolean=false, method: "add" | "update", data: OrdersObj, value: number | "") => {
        let obj = {...data};
        if (checked) {
            obj.quantity[item] = value ?? "";
            if (!obj.menu_items.includes(Number(item))) {
                obj.menu_items = [...obj.menu_items, Number(item)];
            }
        } else {
            delete obj.quantity[item];
            obj.menu_items = obj.menu_items.filter(id => id !== Number(item));
        }
        method === "add" ? setNewOrder(obj) : setUpdateOrder(obj);
    };

    // Handle submit multipart form to backend
    const handleSubmit = async (e: any, method: "add" | "update" | "delete", data: OrdersObj) => {
        e.preventDefault();
        const itemPath = `${endpoints.prefix}${endpoints["orders"]}${slugify(String(data.id))}/`;
        switch (method) {
            case "delete":
                await axios.delete( itemPath,
                ).then(() => {
                    console.log(`Successfully deleted order number ${data.id}`);
                    setUpdateItem(false);
                    getOrders();
                }).catch(error => 
                    console.log(error)
                );
                break;
            case "add":
                await axios.postForm(
                    `${endpoints.prefix}${endpoints["orders"]}`, {
                        notes: newOrder.notes,
                        "menu_items[]": newOrder.menu_items,
                        "quantity{}": newOrder.quantity
                    }, { formSerializer: { metaTokens: false, indexes: null }}
                ).then(() => {
                    console.log(`Successfully added order number ${data.id}`);
                    setAddItem(false);
                    getOrders();
                }).catch(error => {
                    console.log(error);
                });
                break;
            case "update":
                axios.patchForm(itemPath, {
                    notes: updateOrder.notes,
                    "menu_items[]": updateOrder.menu_items,
                    "quantity{}": updateOrder.quantity
                }, { formSerializer: { metaTokens: false, indexes: null }}
                ).then(() => {
                    setUpdateItem(false);
                    getOrders();
                }).catch(error => {
                    console.log(error);
                })
                break;
            default:
                console.log("Unrecognised method");  
        }  

    };

    const handleCheck = (e: any, id: number, field: string) => {
        e.preventDefault();
        const itemPath = `${endpoints.prefix}${endpoints["orders"]}${slugify(String(id))}/`;
        axios.patch(itemPath, {
            [field]: e.target.checked
        }).then(() => getOrders())
        .catch((error) => {
            console.log(error);
        });

    };

    return (
        <Container className={`orders ${ props.theme }`}>
            <Row className='title'>
                <h2>Orders</h2>
            </Row>
            
            <Row xs={2} className='actions'>
                <Button className="add" onClick={() => {
                    setNewOrder(ordersObj);
                    setAddItem(!addItem);
                }}>Add Item +</Button>
                <Button className="archive" as="a" href="/orders/archive">Archive</Button>
            </Row>

            <OrdersForm 
                addItem={addItem}
                onHide={() => setAddItem(false)}
                handleData={handleData}
                handleQuantity={handleQuantity}
                handleSubmit={handleSubmit}
                newOrder={newOrder}
                menu={menu}
                theme={ props.theme }
            />

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

                    { 
                        orders.map((item, i) => {
                            return (
                                <tr className="rows" onClick={item => {
                                    setUpdateOrder({...ordersObj, ...item});
                                    setUpdateItem(!updateItem);
                                }} key={i}>
                                    <td className='id' >{item.id}</td>
                                    <td className='menu-items' >{item.menu_items.map((item, i) => {
                                        return (
                                            <p key={i}>{menu[item]?.["title"]}</p>
                                        )
                                    }
                                    )}</td>
                                    <td className='notes' >{item.notes}</td>
                                    <td className='ordered-at' >{String(item.ordered_at)}</td>
                                    <td className='prepared-at-check' ><Form.Check onChange={(e) => handleCheck(e, item.id!, "prepared")} onClick={e => e.stopPropagation()} checked={ item.prepared }/></td>
                                    <td className='prepared-at' >{String(item.prepared_at)}</td>
                                    <td className='delivered-at-check'><Form.Check onChange={(e) => handleCheck(e, item.id!, "delivered")} onClick={e => e.stopPropagation()} checked={ item.delivered }/></td>
                                    <td className='delivered-at' >{String(item.delivered_at)}</td>
                                    <td className='complete-check'><Form.Check onChange={(e) => handleCheck(e, item.id!, "complete")} onClick={e => e.stopPropagation()} checked={ item.complete }/></td>
                                </tr>
                                )

                        })
                    }
                </tbody>
            </Table>

            <OrderUpdateForm
                updateItem={ updateItem }
                onHide={ () => setUpdateItem(false) }
                handleData={ handleData }
                handleQuantity={ handleQuantity }
                updateOrder={ updateOrder }
                menu={ menu } 
                handleSubmit={ handleSubmit }
                theme={ props.theme }
            />

        </Container>
    )
};

export default Orders;