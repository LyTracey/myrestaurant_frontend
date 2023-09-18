import { 
    useMemo,
    MouseEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { externalEndpoints } from '../../../data/endpoints';
import "../../../styles/orders.scss";
import { useContext } from 'react';
import { GlobalContext } from '../App';
import { dataAPI } from '../../modules/axiosInstances';
import { MenuType } from '../Menu/menuForm';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { GridColDef, GridRenderCellParams, DataGrid, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import ICONS from '../../../data/icons';
import { Toolbar } from './orders';

function ArchivedOrders () {

    // Unpack data from loader
    const [archivedOrders, menu]: any = useLoaderData();

    // Get context data
    const { theme: [theme] } = useContext(GlobalContext);
    const { TrueIcon, FalseIcon, EditIcon, ReturnIcon } = ICONS;
    const revalidator = useRevalidator();
    
    // Set variables
    const filteredMenu = useMemo<{[key: number]: string}>(() => {
        return Object.fromEntries(menu
            .filter((item: MenuType) => item.available_quantity! > 0 )
            .map((item: MenuType) => [item.id!, item.title!]
            ))
    }, [menu]);


    // Handle requests to the backend
    const handleEditOrder = async (e: MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault();

        await dataAPI.patch(`${ externalEndpoints.orders }${ id }/`, { complete: false });

        revalidator.revalidate();
    };

    const Columns: GridColDef[] = [
        { field: "id", headerName: "ID", type: "string", width: 75}, 
        { field: "menu_items", headerName: "Items", type: "string", minWidth: 150, sortable: false, renderCell: ({ row, value }) => {
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
        { field: "prepared_at", headerName: "Prepared Time", type: "dateTime", width: 175, valueGetter: ({ row }) => row.prepared_at ? new Date(row.prepared_at) : null},
        { field: "delivered_at", headerName: "Delivered Time", type: "dateTime", width: 175, 
            valueGetter: ({ row }) => row.delivered_at ? new Date(row.delivered_at) : null
        },
        { field: "complete", headerName: "Complete", type: "boolean", sortable: false,
            renderCell: ({ row }: GridRenderCellParams) => 
                <Tooltip title={row.complete ? `Order complete!` : "Order not complete"} placement='right-end'>
                    <div>
                        { row.complete ? <TrueIcon /> : <FalseIcon /> }
                    </div>
                </Tooltip>
        },
        { field: "actions", type: "actions", getActions: ({ row }: GridRowParams) => [
            <GridActionsCellItem icon={ <EditIcon className='table-button' /> } onClick={(e: MouseEvent<HTMLElement>) => handleEditOrder(e, row.id)} label="Edit" />,
        ]}
    ];

    return (
        <Container className={`page orders ${ theme }`}>
            <Row className='title'>
                <h2 className="title">Archived Orders</h2>
            </Row>
            
            <Row className='actions'>
                <Button className="button live-orders" as="a" href='/orders'>
                    <ReturnIcon className='icon'/>Live Orders
                </Button>
            </Row>

            <DataGrid 
                columns={ Columns }
                rows={ archivedOrders }
                checkboxSelection={ true }
                slots={{ toolbar:  Toolbar }}
                getRowHeight={() => "auto"}
                className='table'
            />

        </Container>
    )
};

export default ArchivedOrders;