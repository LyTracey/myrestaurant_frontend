import { 
    useContext, 
    useRef,
    useMemo,
    createContext
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { externalEndpoints, internalEndpoints } from '../../../data/endpoints';
import "../../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { GlobalContext } from '../App';
import { dataAPI } from '../App';
import { MenuObj } from '../Menu/menu';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export const OrdersContext = createContext<any>(null);

export interface OrdersObj {
    id?: number | null,
    menu_items: Array<number>,
    quantity: {[key: string]: number | ""},
    notes: string,
    ordered_at: Date | null,
    prepared: boolean,
    prepared_at: Date | null,
    delivered: boolean,
    delivered_at: Date | null,
    complete: boolean
};

export const ORDERS_OBJ = {
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


function Orders () {
    // Unpack loader data
    const [orders, menu]: any = useLoaderData();

    // Form states
    const updateObj = useRef<OrdersObj>(structuredClone(ORDERS_OBJ));
    const { theme: [theme], feedback: [setFeedback] }  = useContext(GlobalContext);
    const navigate = useNavigate();

    // Set variables
    const filteredMenu = useMemo<{[key: number]: string}>(() => {
        return Object.fromEntries(menu
            .filter((item: MenuObj) => item.available_quantity! > 0 )
            .map((item: MenuObj) => [item.id!, item.title!]
            ))
    }, [menu]);

    const availabilities = useMemo<{[key: number]: number}>(() => 
        Object.fromEntries(menu.map((item: any) => [item.id, item.available_quantity]))
    , [menu]);

    const ordersContextValue = {
        menu: filteredMenu,
        updateObj: updateObj,
        availabilities: availabilities
    };

    // Send PATCH request every time an order is prepared, delivered, or completed
    const handleCheck = (e: any, id: number, field: string, index: number) => {
        e.preventDefault();

        // Check if checkboxes are ticked in the order prepared > delivered > complete
        if (field === "delivered" && !orders[index]?.prepared) {
            setFeedback(["Please ensure order is prepared."])
            return
        } else if (field === "complete" && (!orders[index]?.prepared || !orders[index]?.delivered)) {
            setFeedback(["Please ensure order is prepared and delivered."])
            return
        }


        // Send patch request if the correct checkboxes are checked
        dataAPI.patch(`${ externalEndpoints.orders! }/${ id }`, {
            id: id,
            [field]: e.target.checked
        });
    };

    return (
        <Container className={`page orders ${ theme }`}>

            <Row className='title'>
                <h2>Orders</h2>
            </Row>
            
            <Row xs={2} className='actions'>
                <Button className="add" onClick={() => navigate(internalEndpoints.ordersCreate!)}>Add Item +</Button>
                <Button className="archive" as="a" href="/orders/archive">Archive</Button>
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

                    { 
                        orders.map((item: OrdersObj, i: number) => {
                            return (
                                <tr className="rows" onClick={() => {
                                        updateObj.current = {...ORDERS_OBJ, ...item};
                                        navigate(internalEndpoints.ordersUpdate!);
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
                                    <td className='prepared-at-check' ><Form.Check onChange={(e) => handleCheck(e, item.id!, "prepared", i)} onClick={e => e.stopPropagation()} checked={ item.prepared }/></td>
                                    <td className='prepared-at' >{String(item.prepared_at)}</td>
                                    <td className='delivered-at-check'><Form.Check onChange={(e) => handleCheck(e, item.id!, "delivered", i)} onClick={e => e.stopPropagation()} checked={ item.delivered }/></td>
                                    <td className='delivered-at' >{String(item.delivered_at)}</td>
                                    <td className='complete-check'><Form.Check onChange={(e) => handleCheck(e, item.id!, "complete", i)} onClick={e => e.stopPropagation()} checked={ item.complete }/></td>
                                </tr>
                            )

                        })
                    }
                </tbody>
            </Table>
            

            <OrdersContext.Provider value={ ordersContextValue }>
                <Outlet />
            </OrdersContext.Provider>



        </Container>
    )
};

export default Orders;