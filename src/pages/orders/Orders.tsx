import { 
    useContext, 
    useMemo,
    createContext,
    useState,
    useRef,
    MouseEvent
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { externalEndpoints, internalEndpoints } from '../../data/endpoints';
import "../../styles/orders.scss";
import { GlobalContext } from '../../App';
import { MenuType } from '../menu/MenuForm';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Outlet, useRevalidator } from 'react-router-dom';
import { 
    DataGrid, 
    GridColDef, 
    GridToolbarContainer, 
    GridToolbarExport, 
    GridToolbarColumnsButton, 
    GridToolbarFilterButton,
    GridActionsCellItem,
    GridRowParams,
    GridRenderCellParams
} from '@mui/x-data-grid';
import ICONS from '../../data/icons';
import { DeleteAlert } from '../../messages/base';
import { dataAPI } from '../../api/axiosInstances';
import { DisplayFeedback } from '../../messages/base';
import Tooltip from '@mui/material/Tooltip';

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

export function Toolbar ()  {
    return (
        <GridToolbarContainer className='table-toolbar'>
            <div>
                <GridToolbarColumnsButton className='table-button'/>
                <GridToolbarFilterButton className='table-button'/>
            </div>

            <GridToolbarExport className="table-button"/>
        </GridToolbarContainer>
    )
}


function Orders () {

    // Unpack loader data
    const [orders, menu]: any = useLoaderData();

    // Form states
    const { theme: [theme], feedback: [, setFeedback] }  = useContext(GlobalContext);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const deleteObj = useRef<number>(0);
    
    // Utils
    let revalidator = useRevalidator();
    const navigate = useNavigate();
    const { EditIcon, DeleteIcon, FalseIcon, TrueIcon, CreateIcon, ArchiveIcon } = ICONS;

    // Map orders and menu lists into object
    const filteredOrders = useMemo<{[key: number]: string}>(() =>
        Object.fromEntries(orders.map((orderObj: {[key: string]: any}) => [orderObj.id, orderObj]))
    , [orders]);

    const filteredMenu = useMemo<{[key: number]: string}>(() => {
        return Object.fromEntries(menu.map((menuObj: MenuType) => [menuObj.id!, menuObj.title!]))
    }, [menu]);


    // Get object of availabilities
    const availabilities = useMemo<{[key: number]: number}>(() => 
        Object.fromEntries(menu.map((item: any) => [item.id, item.available_quantity]))
    , [menu]);

    const ordersContextValue = {
        menu: filteredMenu,
        orders: filteredOrders,
        availabilities: availabilities
    };

    // Send PATCH request every time an order is prepared, delivered, or completed
    const handleCheck = async (e: MouseEvent<HTMLDivElement>, row: {[key: string]: any}, field: string) => {
        e.stopPropagation();

        // Check if checkboxes are ticked in the order prepared > delivered > complete
        if (field === "delivered" && !row.prepared) {
            setFeedback(["Please ensure order is prepared."])
            return
        } else if (field === "complete" && (!row.prepared || !row.delivered)) {
            setFeedback(["Please ensure order is prepared and delivered."])
            return
        }

        // Send patch request if the correct checkboxes are checked
        await dataAPI.patch(`${ externalEndpoints.orders! }${ row.id }/`, {
            id: row.id,
            [field]: !row[field]
        });

        revalidator.revalidate();
    };

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
        { field: "notes", headerName: "Notes", type: "string", width: 150, sortable: false},
        { field: "ordered_at", headerName: "Order Time", type: "dateTime", width: 175, valueGetter: ({ row }) => new Date(row.ordered_at) },
        { field: "prepared", headerName: "Prepared", type: "boolean", sortable: false, renderCell: ({ row }: GridRenderCellParams) => 
            <Tooltip title={row.prepared ? `Prepared at ${ row.prepared_at }` : "Not prepared"} placement='right-end'>
                <div onClick={(e) => handleCheck(e, row, "prepared")}>
                    { row.prepared ? <TrueIcon /> : <FalseIcon /> }
                </div>
            </Tooltip>
        },
        { field: "prepared_at", headerName: "Prepared Time", type: "dateTime", width: 175, valueGetter: ({ row }) => row.prepared_at ? new Date(row.prepared_at) : null},
        { field: "delivered", headerName: "Delivered", type: "boolean", sortable: false,
            renderCell: ({ row }: GridRenderCellParams) => 
                <Tooltip title={row.delivered ? `Delivered at ${ row.delivered_at }` : "Not delivered"} placement='right-end'>
                    <div onClick={(e) => handleCheck(e, row, "delivered")}
                    >{ row.delivered ? <TrueIcon /> : <FalseIcon /> }</div>
                </Tooltip>
        },
        { field: "delivered_at", headerName: "Delivered Time", type: "dateTime", width: 175, 
            valueGetter: ({ row }) => row.delivered_at ? new Date(row.delivered_at) : null
        },
        { field: "complete", headerName: "Complete", type: "boolean", sortable: false,
            renderCell: ({ row }: GridRenderCellParams) => 
                <Tooltip title={row.complete ? `Order complete!` : "Order not complete"} placement='right-end'>
                    <div onClick={(e) => handleCheck(e, row, "complete")}>
                        { row.complete ? <TrueIcon /> : <FalseIcon /> }
                    </div>
                </Tooltip>
        },
        { field: "actions", type: "actions", getActions: (params: GridRowParams) => [
            <GridActionsCellItem icon={ <EditIcon title="Edit order" className='table-button' /> } onClick={() => {
                navigate(`${ internalEndpoints.ordersUpdateRoot! }/${ params.row.id }`);
            }} label="Edit" />,
            <GridActionsCellItem icon={ <DeleteIcon title="Delete order" className='table-button' /> } onClick={() => {
                deleteObj.current = params.row.id;
                setShowDelete(true);
            }} label="Delete" />
        ]}
    ];

    return (
        <Container className={`page orders ${ theme }`}>

            <h2 className='title'>Orders</h2>

            <DisplayFeedback />
            
            <Row xs={2} className='actions'>
                <Button className="button create" onClick={() => navigate(internalEndpoints.ordersCreate!)}><CreateIcon className="icon"/></Button>
                <Button className="button archive" as="a" href="/orders/archive"><ArchiveIcon className='icon'/> Archive</Button>
            </Row>

            <DataGrid 
                columns={ Columns }
                rows={ orders }
                checkboxSelection={ true }
                slots={{ toolbar:  Toolbar }}
                getRowHeight={() => "auto"}
                className='table'
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            prepared_at: false,
                            delivered_at: false
                        }
                    }
                }}
            />

            {
                showDelete &&
                <DeleteAlert 
                    onClickYes={async () => {
                        await dataAPI.delete(`${ externalEndpoints.orders! }${ deleteObj.current }`);
                        setShowDelete(false);
                        revalidator.revalidate();
                    }}
                    onClickCancel={() => {
                        setShowDelete(false);
                    }}
                />

            }

            <OrdersContext.Provider value={ ordersContextValue }>
                <Outlet />
            </OrdersContext.Provider>



        </Container>
    )
};

export default Orders;