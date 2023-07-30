import {
        useState, 
        useEffect, 
        useContext, 
        FormEvent,
        Dispatch,
        SetStateAction,
        useRef
} from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import { NavLink } from "react-router-dom";
import {ReactComponent as CoffeeBeans} from "../../../images/icons/coffee-beans.svg";
import { externalEndpoints } from "../../../data/endpoints";
import InventoryUpdateForm from "./inventoryUpdateForm";
import slugify from "slugify";
import "../../../styles/inventory.scss";
import { GlobalContext } from '../../App';
import { AxiosError } from 'axios';
import { submitDataRequest } from "../../../utils/apiUtils";
import { fetchData } from "../../../utils/apiUtils";
import { Outlet } from "react-router-dom";


export interface InventoryObj {
    [index: string]: any,
    id?: number | null,
    ingredient: string,
    quantity: number | null,
    unit_price: number | null,
    image?: string | null
};

export const INVENTORY_OBJ = {
    id: null,
    ingredient: "",
    quantity: null,
    unit_price: null,
    image: null
};

// Fetch inventory data
// export function fetchData (setInventory: Dispatch<SetStateAction<Array<InventoryObj>>>, setLoading: Dispatch<SetStateAction<boolean>>) {
//     setLoading(true);
//     dataAPI.get(`${externalEndpoints["inventory"]}`)
//     .then((inventoryResponse: AxiosResponse) => {
//         setInventory(inventoryResponse.data);
//         setLoading(false);
//     })
//     .catch((inventoryError: AxiosError) => {
//         console.log(inventoryError);
//         setLoading(false);
//     });
// };


function Inventory () {

    // External data states
    const [inventory, setInventory] = useState<Array<InventoryObj>>([]);

    // Form states
    const [openForm, setOpenForm] = useState<"add" | "update" | "none">("none")
    const updateInventory = useRef<InventoryObj>(structuredClone(INVENTORY_OBJ));
    const { theme: [theme], loading: [setLoading] } = useContext(GlobalContext);


    // Fetch inventory on load
    useEffect(() => {
        setLoading(true);
        fetchData(
        externalEndpoints["inventory"]!, 
        (response) => setInventory(response.data))
    }, []);


    // Handle submit to backend
    const handleSubmit = (e: FormEvent<HTMLFormElement>, method: string, data: InventoryObj, setValidated: Dispatch<SetStateAction<boolean>>) => {
        submitDataRequest({
            event: e,
            method: method,
            data: data,
            url: method === "add" ? `${externalEndpoints["inventory"]}` : `${externalEndpoints["inventory"]}${slugify(String(data.id) ?? "")}/`,
            resolve: () => {
                setOpenForm("none");
                fetchData(externalEndpoints["inventory"]!, (response) => setInventory(response.data));
            },
            reject: (error: AxiosError) => console.log(error),
            setValidated: setValidated
        })
    };

    return (
        <Container className={`page inventory ${ theme }`}>
            <Row className='title'>
                <h2>Inventory</h2>
            </Row>

            <Row className='actions'>
                {/* <Button onClick={() => setOpenForm("add")}>Add Item +</Button> */}
                <NavLink to="/inventory/create">+ Create Item</NavLink>
            </Row>

            <Row xs={1} md={2} lg={3}>
                { inventory.map((item, i) => {
                    return (
                        <Col key={`inventory-item-${i}`}>
                            <Card.Body onClick={() => {
                                    updateInventory.current = ({...INVENTORY_OBJ, ...item});
                                    setOpenForm("update");
                                }}>
                                <Card.Title>{ item.ingredient }</Card.Title>
                                <CoffeeBeans className="icon"/>
                                <div className='card-details'>
                                    <Card.Text>Available: { item.quantity }</Card.Text>
                                    <Card.Text>{ `£ ${ item.unit_price }` }</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>
            
            <Outlet />

            <InventoryUpdateForm
                openForm={ openForm }
                onHide={ () => setOpenForm("none") }
                handleSubmit={ handleSubmit }
                updateInventory={ updateInventory }
            />

        </Container>

    )
}

export default Inventory;
