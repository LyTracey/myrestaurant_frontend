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
import Button from 'react-bootstrap/Button';
import {ReactComponent as CoffeeBeans} from "../../../images/icons/coffee-beans.svg";
import endpoints from "../../../data/endpoints";
import InventoryCreateForm from "./inventoryCreateForm";
import InventoryUpdateForm from "./inventoryUpdateForm";
import slugify from "slugify";
import "../../../styles/inventory.scss";
import { ThemeContext, dataAPI } from '../Base/App';
import { AxiosResponse, AxiosError } from 'axios';
import { submitDataRequest } from "../../../utils/baseUtils";


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
export function fetchData (setInventory: Dispatch<SetStateAction<Array<InventoryObj>>>) {
    dataAPI.get(`${endpoints["inventory"]}`)
    .then((inventoryResponse: AxiosResponse) =>
        setInventory(inventoryResponse.data)
    )
    .catch((inventoryError: AxiosError) =>
        console.log(inventoryError)
    )
};



function Inventory () {

    // External data states
    const [inventory, setInventory] = useState<Array<InventoryObj>>([]);

    // Form states
    const [openForm, setOpenForm] = useState<"add" | "update" | "none">("none")
    const updateInventory = useRef<InventoryObj>(structuredClone(INVENTORY_OBJ));
    const theme = useContext(ThemeContext);


    // Fetch inventory on load
    useEffect(() => fetchData(setInventory), []);


    // Handle submit to backend
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, method: string, data: InventoryObj, setValidated: Dispatch<SetStateAction<boolean>>) => {

        await submitDataRequest({
            event: e,
            method: method,
            data: data,
            url: method === "add" ? `${endpoints["inventory"]}` : `${endpoints["inventory"]}${slugify(String(data.id) ?? "")}/`,
            resolve: () => {
                setOpenForm("none");
                fetchData(setInventory);
            },
            reject: (error: AxiosError) => console.log(error),
            setValidated: setValidated
        })
    };

    return (
        <Container className={`inventory ${ theme }`}>
            <Row className='title'>
                <h2>Inventory</h2>
            </Row>

            <Row className='actions'>
                <Button onClick={() => 
                    setOpenForm("add")
            }>Add Item +</Button>
            </Row>

            <InventoryCreateForm
                theme={ theme }
                openForm={ openForm }
                onHide={() => setOpenForm("none")}
                handleSubmit={ handleSubmit }
            />

            <InventoryUpdateForm
                theme={ theme }
                openForm={ openForm }
                onHide={ () => setOpenForm("none") }
                handleSubmit={ handleSubmit }
                updateInventory={ updateInventory }
            />

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

        </Container>

    )
}

export default Inventory;
