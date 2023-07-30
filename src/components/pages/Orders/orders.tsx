import { 
    useState, 
    useEffect, 
    SetStateAction, 
    Dispatch, 
    useContext, 
    FormEvent,
    useRef,
    useMemo
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { externalEndpoints } from '../../../data/endpoints';
import "../../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import OrdersCreateForm from './ordersCreateForm';
import OrderUpdateForm from "./ordersUpdateForm";
import slugify from 'slugify';
import { GlobalContext } from '../../App';
import { MenuObj } from '../Menu/menu';
import { submitDataRequest } from '../../../utils/apiUtils';
import { fetchData } from '../../../utils/apiUtils';

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


// Fetch orders data from backend
// export function fetchData (setOrders: Dispatch<SetStateAction<Array<OrdersObj>>>, setMenu: Dispatch<SetStateAction<Array<MenuObj>>>) {
//         axios.all([
//             dataAPI.get(`${externalEndpoints["orders"]}`),
//             dataAPI.get( `${externalEndpoints["menu"]}`)
//         ])
//         .then(axios.spread((orderResponse: AxiosResponse, menuResponse: AxiosResponse) => {
//             setOrders(orderResponse.data);
//             setMenu(menuResponse.data);
//         })).catch(axios.spread((ordersError: AxiosError, menuError: AxiosError) => {
//             console.log(ordersError);
//             console.log(menuError);
//         }));
//     };



function Orders () {
    
    
    // Fetched data states
    const [orders, setOrders] = useState<Array<OrdersObj>>([]);
    const [menu, setMenu] = useState<Array<MenuObj>>([]);


    // Form states
    const [openForm, setOpenForm] = useState<"add" | "update" | "none">("none");
    const updateOrder = useRef<OrdersObj>(structuredClone(ORDERS_OBJ));
    const { theme: [theme], feedback: [setFeedback]}  = useContext(GlobalContext);


    // Set variables
    const filteredMenu = useMemo<{[key: number]: string}>(() => {
        return Object.fromEntries(menu
            .filter((item: MenuObj) => item.available_quantity! > 0 )
            .map((item: MenuObj) => [item.id!, item.title!]
            ))
    }, [menu]);

    const availabilities = useMemo<{[key: number]: number}>(() => 
        Object.fromEntries(menu.map((item: any) => [item.id, item.available_quantity]))
    , [filteredMenu]);


    // Fetch menu data and ingredients data on first load
    useEffect(() => {
        fetchData(externalEndpoints["orders"]!, (response) => setOrders(response.data));
        fetchData(externalEndpoints["menu"]!, (response) => setMenu(response.data));
    }, []);


    // Handle requests to the backend
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, method: string, data: OrdersObj | {[key:string]: boolean | number}, setValidated: Dispatch<SetStateAction<boolean>> | null=null) => {

        await submitDataRequest({
            event: e,
            method: method,
            data: data,
            url: method === "add" ? `${externalEndpoints["orders"]}` : `${externalEndpoints["orders"]}${slugify(String(data.id) ?? "")}/`,
            resolve: () => {
                setOpenForm("none");
                fetchData(externalEndpoints["orders"]!, (response) => setOrders(response.data));
                fetchData(externalEndpoints["menu"]!, (response) => setMenu(response.data));
            },
            setValidated: setValidated
        })
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
        handleSubmit(e, "update", {
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
                <Button className="add" onClick={() =>
                    setOpenForm("add")
                }>Add Item +</Button>
                <Button className="archive" as="a" href="/orders/archive">Archive</Button>
            </Row>

            <OrdersCreateForm 
                theme={ theme }
                openForm={ openForm }
                onHide={ () => setOpenForm("none") } 
                handleSubmit={ handleSubmit }
                menu={ filteredMenu }
                availabilities={ availabilities }
            />

            <OrderUpdateForm
                theme={ theme }
                openForm={ openForm }
                onHide={() => setOpenForm("none") }
                handleSubmit={ handleSubmit }
                updateOrder={ updateOrder }
                menu={ filteredMenu }
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
                                        updateOrder.current = {...ORDERS_OBJ, ...item};
                                        setOpenForm("update");
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




        </Container>
    )
};

export default Orders;