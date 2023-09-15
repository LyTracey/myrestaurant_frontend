import { 
    useMemo,
    MouseEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { externalEndpoints } from '../../../data/endpoints';
import "../../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import slugify from 'slugify';
import { useContext } from 'react';
import { GlobalContext } from '../App';
import { dataAPI } from '../../modules/axiosInstances';
import { MenuObj } from '../Menu/menu';
import { OrdersObj } from './orders';
import { useLoaderData } from 'react-router-dom';

function ArchivedOrders () {

    // Unpack data from loader
    const [archivedOrders, menu]: any = useLoaderData();

    // Get context data
    const { theme: [theme] } = useContext(GlobalContext);
      
    
    // Set variables
    const filteredMenu = useMemo<{[key: number]: string}>(() => {
        return Object.fromEntries(menu
            .filter((item: MenuObj) => item.available_quantity! > 0 )
            .map((item: MenuObj) => [item.id!, item.title!]
            ))
    }, [menu]);


    // Handle requests to the backend
    const handleSubmit = async (e: MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault();

        await dataAPI.patch(`${ externalEndpoints.orders }/${slugify(String(id))}`, { complete: false });
    };

    return (
        <Container className={`orders ${ theme }`}>
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
                        archivedOrders.map((item: OrdersObj, i: number) => {
                            return (
                                <tr className='rows' key={`order_${i}`}>
                                    <td className='id'>{ item.id }</td>
                                    <td className='menu-items'>{item.menu_items.map((menuItem, i) => {
                                        return (
                                            <p key={i}>{filteredMenu[menuItem]}</p>
                                        )
                                    }
                                    )}</td>
                                    <td className='notes'>{ item.notes }</td>
                                    <td className='ordered-at'>{ String(item.ordered_at) }</td>
                                    <td className='prepared-at'>{ String(item.prepared_at) }</td>
                                    <td className='delivered-at'>{ String(item.delivered_at) }</td>
                                    <td className='edit-order'><Button className="edit" onClick={(e) => handleSubmit(e, item.id!)}>Edit</Button></td>
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