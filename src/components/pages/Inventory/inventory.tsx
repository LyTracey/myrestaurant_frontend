import { useContext, createContext, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import { NavLink } from "react-router-dom";
import {ReactComponent as CoffeeBeans} from "../../../images/icons/coffee-beans.svg";
import "../../../styles/inventory.scss";
import { GlobalContext } from '../App';
import { Outlet } from "react-router-dom";
import { useLoaderData } from "react-router-dom";


export const InventoryContext = createContext<any>(null);

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

function Inventory () {

    // Unpack loader data
    const inventory: any = useLoaderData();

    // Form states
    const [updateObj, setUpdateObj] = useState<InventoryObj>(structuredClone(INVENTORY_OBJ));
    const { theme: [theme] } = useContext(GlobalContext);

    // Context value
    const inventoryContextValue = {
        updateObj: updateObj
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
                { inventory.map((item: InventoryObj, i: number) => {
                    return (
                        <Col key={`inventory-item-${i}`}>
                            <Card.Body onClick={() =>  setUpdateObj({...INVENTORY_OBJ, ...item})}>
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
            
            
        <InventoryContext.Provider value={ inventoryContextValue }>
            <Outlet />
        </InventoryContext.Provider>

        </Container>

    )
}

export default Inventory;
