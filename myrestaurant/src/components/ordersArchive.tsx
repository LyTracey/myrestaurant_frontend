import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import { OrdersObj, MenuItemsObj } from '../types/orderTypes';
import "../style/orders.scss";
import Table from 'react-bootstrap/Table';
import slugify from 'slugify';

function ArchivedOrders ( props: any ) {
    
    // Set states
    const [orders, setOrders] = useState<Array<OrdersObj>>([]);
    const [menu, setMenu] = useState<MenuItemsObj>({});
        
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    // Fetch menu data from backend
    const getOrders = () => {
        axios.get(
            `${endpoints.prefix}${endpoints["archivedOrders"]}`
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
            // Return object of id as key and ingredient as value fields for each inventory item 
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

    // Handle submit multipart form to backend
    const handleSubmit = async (e: any, id: number) => {
        e.preventDefault();
        const itemPath = `${endpoints.prefix}${endpoints["orders"]}${slugify(String(id))}/`;
            axios.patch(itemPath, {
                complete: false
            }).then(() => {
                getOrders();
            }).catch(error => {
                console.log(error);
            })
    };

    return (
        <Container className={`orders ${ props.theme }`}>
            <Row className='title'>
                <h2>Archived Orders</h2>
            </Row>
            
            <Row className='actions'>
                <Button className="live-orders" as="a" href='/orders'>Live Orders</Button>
            </Row>

            <Table responsive>
                <thead>
                    <tr className='headers'>
                        <th>Order ID</th>
                        <th>Menu Items</th>
                        <th>Notes</th>
                        <th>Ordered At</th>
                        <th>Prepared At</th>
                        <th>Delivered At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    { 
                        orders.map((item, i) => {
                            return (
                                <tr className='rows' key={i}>
                                    <td className='id'>{ item.id }</td>
                                    <td className='menu-items'>{item.menu_items.map((item, i) => {
                                        return (
                                            <p key={i}>{menu[item]?.["title"]}</p>
                                        )
                                    }
                                    )}</td>
                                    <td className='notes'>{ item.notes }</td>
                                    <td className='ordered-at'>{ String(item.ordered_at) }</td>
                                    <td className='prepared-at'>{ String(item.prepared_at) }</td>
                                    <td className='delivered-at'>{ String(item.delivered_at) }</td>
                                    <td className='edit-order'><Button className="edit" onClick={(e) => handleSubmit(e, item.id! )}>Edit</Button></td>
                                </tr>
                                )

                        })
                    }
                </tbody>
            </Table>

        </Container>
    )
};

export default ArchivedOrders;