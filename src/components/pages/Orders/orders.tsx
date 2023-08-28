import { 
    useContext, 
    useRef,
    useMemo,
    createContext
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { internalEndpoints } from '../../../data/endpoints';
import "../../../styles/orders.scss";
import { GlobalContext } from '../App';
// import { dataAPI } from '../App';
import { MenuObj } from '../Menu/menu';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton } from '@mui/x-data-grid';

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

function Toolbar ()  {
    return (
        <GridToolbarContainer className='table-toolbar'>
            <div>
                <GridToolbarColumnsButton className='toolbar-button'/>
                <GridToolbarFilterButton className='toolbar-button'/>
            </div>

            <GridToolbarExport className="toolbar-button"/>
        </GridToolbarContainer>
    )
}


function Orders () {
    // Unpack loader data
    const [orders, menu]: any = useLoaderData();

    // Form states
    const updateObj = useRef<OrdersObj>(structuredClone(ORDERS_OBJ));
    const { theme: [theme] }  = useContext(GlobalContext);
    const navigate = useNavigate();

    // Set variables
    const filteredMenu = useMemo<{[key: number]: string}>(() => {
        return Object.fromEntries(menu.filter((menu: MenuObj) => menu.available_quantity! > 0 )
            .map((item: MenuObj) => [item.id!, item.title!]))
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
    // const handleCheck = (e: any, id: number, field: string, index: number) => {
    //     e.preventDefault();

    //     // Check if checkboxes are ticked in the order prepared > delivered > complete
    //     if (field === "delivered" && !orders[index]?.prepared) {
    //         setFeedback(["Please ensure order is prepared."])
    //         return
    //     } else if (field === "complete" && (!orders[index]?.prepared || !orders[index]?.delivered)) {
    //         setFeedback(["Please ensure order is prepared and delivered."])
    //         return
    //     }


    //     // Send patch request if the correct checkboxes are checked
    //     dataAPI.patch(`${ externalEndpoints.orders! }/${ id }`, {
    //         id: id,
    //         [field]: e.target.checked
    //     });
    // };

    const Columns: GridColDef[] = [
        { field: "id", headerName: "ID", type: "string", width: 75}, 
        { field: "menu_items", headerName: "Items", type: "string", minWidth: 250, sortable: false, renderCell: ({ row, value }) => {
            return (
                <div className='menu-items'>
                    { 
                        value.map((menuID: number, i: number) => {
                            return (
                                <div className='menu-item' key={ `menu_item_${i}` }>
                                    <span>{ `${ filteredMenu[menuID] }` }</span> <span>x { row.quantity[menuID] }</span>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }},
        { field: "notes", headerName: "Notes", type: "string", width: 200, sortable: false},
        { field: "ordered_at", headerName: "Order Time", type: "dateTime", width: 175, valueGetter: ({ row }) => new Date(row.ordered_at) },
        { field: "prepared", headerName: "Prepared", type: "boolean", sortable: false },
        { field: "prepared_at", headerName: "Prepared Time", type: "dateTime", width: 175, valueGetter: ({ row }) => new Date(row.ordered_at) },
        { field: "delivered", headerName: "Delivered", type: "boolean", sortable: false },
        { field: "delivered_at", headerName: "Delivered Time", type: "dateTime", width: 175, valueGetter: ({ row }) => new Date(row.ordered_at) },
        { field: "complete", headerName: "Complete", type: "boolean", sortable: false }
    ];

    return (
        <Container className={`page orders ${ theme }`}>

            <h2 className='title'>Orders</h2>
            
            <Row xs={2} className='actions'>
                <Button className="button add" onClick={() => navigate(internalEndpoints.ordersCreate!)}>Add Item +</Button>
                <Button className="button archive" as="a" href="/orders/archive">Archive</Button>
            </Row>

            <DataGrid 
                columns={ Columns }
                rows={ orders }
                checkboxSelection={ true }
                slots={{ toolbar:  Toolbar }}
                getRowHeight={() => "auto"}
                className='table'
            />

            {/* <Table responsive>
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
            </Table> */}
            

            <OrdersContext.Provider value={ ordersContextValue }>
                <Outlet />
            </OrdersContext.Provider>



        </Container>
    )
};

export default Orders;