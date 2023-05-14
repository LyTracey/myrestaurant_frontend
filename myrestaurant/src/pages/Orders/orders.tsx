import { useState, useEffect } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
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
import { OrdersObj, MenuItemsObj} from "./orderTypes";

function Orders ( props: any ) {
    
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
    const [orders, setOrders] = useState<Array<OrdersObj>>([]);
    const [menu, setMenu] = useState<MenuItemsObj>({});
    const [newOrder, setNewOrder] = useState<OrdersObj>(ordersObj);
    const [addItem, setAddItem] = useState<boolean>(false);
    const [updateOrder, setUpdateOrder] = useState<OrdersObj>(ordersObj);
    const [updateItem, setUpdateItem] = useState<boolean>(false);
    
    // Set contexts
    const theme = useContext(ThemeContext);

    // Set variables
    const entries = Object.entries(menu).map((item: any) => [item[0], item[1].available_quantity]);
    const availabilities = Object.fromEntries(entries);

    // Fetch menu data from backend
    const getOrders = () => {
        props.dataAPI.get(
            `${endpoints["orders"]}`
        ).then((response: AxiosResponse) => {
            setOrders(response.data);
        }).catch((error: AxiosError) => {
            console.log(error);
        });
    };
    
    // Fetch ingredients from backend
    const getMenu = () => {
        props.dataAPI.get(
            `${endpoints["menu"]}`
        ).then((response: AxiosResponse) => {
            const filteredMenu: MenuItemsObj = {};
            response.data.forEach((item: any) => {
                if (item.in_stock) {
                    filteredMenu[item.id] = {title: item.title, available_quantity: item.available_quantity}
                }
            });
            setMenu(filteredMenu);
        }).catch((error: AxiosError) => {
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
    const handleData = (item: string, value: string | number, method: "add" | "update") => {
        method === "add" ? setNewOrder({...newOrder, [item]: value}) : setUpdateOrder({...updateOrder, [item]: value})
    };


    // Handle submit multipart form to backend
    const handleSubmit = async (e: any, method: "add" | "update" | "delete", data: OrdersObj) => {
        e.preventDefault();
        const itemPath = `${endpoints["orders"]}${slugify(String(data.id))}/`;
        switch (method) {
            case "delete":
                await props.dataAPI.delete( itemPath,
                ).then(() => {
                    console.log(`Successfully deleted order number ${data.id}`);
                    setUpdateItem(false);
                    getOrders();
                }).catch((error: AxiosError) => 
                    console.log(error)
                );
                break;
            case "add":
                await props.dataAPI.post(
                    `${endpoints["orders"]}`, {
                        notes: newOrder.notes,
                        "menu_items[]": newOrder.menu_items,
                        "quantity{}": newOrder.quantity
                }).then(() => {
                    console.log(`Successfully added order number ${data.id}`);
                    setAddItem(false);
                    getOrders();
                }).catch((error: AxiosError) => {
                    console.log(error);
                });
                break;
            case "update":
                await props.dataAPI.patch(itemPath, {
                    notes: updateOrder.notes,
                    "menu_items[]": updateOrder.menu_items,
                    "quantity{}": updateOrder.quantity
                }).then(() => {
                    setUpdateItem(false);
                    getOrders();
                }).catch((error: AxiosError) => {
                    console.log(error);
                })
                break;
            default:
                console.log("Unrecognised method");  
        }  

    };

    // Send PATCH request every time an order is prepared, delivered, or completed
    const handleCheck = (e: any, id: number, field: string) => {
        e.preventDefault();
        const itemPath = `${endpoints["orders"]}${slugify(String(id))}/`;
        props.dataAPI.patch(itemPath, {
            [field]: e.target.checked
        }).then(() => getOrders())
        .catch((error: AxiosError) => {
            console.log(error);
        });

    };

    return (
        <Container className={`orders ${ theme }`}>

            <Row className='title'>
                <h2>Orders</h2>
            </Row>
            
            <Row xs={2} className='actions'>
                <Button className="add" onClick={() => {
                    setNewOrder({...ordersObj});
                    setAddItem(!addItem);
                }}>Add Item +</Button>
                <Button className="archive" as="a" href="/orders/archive">Archive</Button>
            </Row>

            <OrdersCreateForm 
                addItem={addItem}
                onHide={() => setAddItem(false)}
                newOrder={ newOrder } 
                setNewOrder={ setNewOrder }
                menu={menu}
                handleSubmit={ handleSubmit }
                handleData={ handleData }
                theme={ theme }
                availabilities={ availabilities }
            />

            <OrderUpdateForm
                updateItem={ updateItem }
                onHide={() => {setUpdateItem(false)}}
                updateOrder={ updateOrder }
                setUpdateOrder={ setUpdateOrder }
                menu={ menu } 
                handleSubmit={ handleSubmit }
                handleData={ handleData }
                theme={ theme }
                availabilities={ availabilities }
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
                                <tr className="rows" onClick={() => {
                                        setUpdateOrder({...item} ?? {...ordersObj});
                                        setUpdateItem(!updateItem);
                                    }} key={i}>
                                    <td className='id' >{item.id}</td>
                                    <td className='menu-items' >{item.menu_items.map((item2, i) => {
                                        return (
                                            <p key={i}>{menu[item2]?.["title"]}</p>
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




        </Container>
    )
};

export default Orders;