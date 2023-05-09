import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import placeholder from "../../images/placeholder-image.webp";
import endpoints from "../../data/endpoints";
import InventoryForm from "./inventoryForm";
import InventoryUpdateForm from "./inventoryUpdateForm";
import slugify from "slugify";
import "../../styles/inventory.scss";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { AxiosResponse, AxiosError } from 'axios';


interface InventoryObj {
    [index: string]: any,
    id?: number | null,
    ingredient: string,
    quantity: number | null,
    unit_price: number | null,
    image?: string | null
};

function Inventory (props: any) {

    // Set states
    const inventoryObj = {
        id: null,
        ingredient: "",
        quantity: null,
        unit_price: null,
        image: null
    };
    
    const [inventory, setInventory] = useState<Array<InventoryObj>>([]);
    const [addItem, setAddItem] = useState<boolean>(false);
    const [updateItem, setUpdateItem] = useState<boolean>(false);
    const [newInventory, setNewInventory] = useState<InventoryObj>(inventoryObj);
    const [updateInventory, setUpdateInventory] = useState<InventoryObj>(inventoryObj);


    // Get inventory
    const getInventory = () => {
        props.dataAPI.get(
            `${endpoints["inventory"]}`
        ).then((response: AxiosResponse) => {
            setInventory(response.data);
        }).catch((error: AxiosError) => {
            console.log(error);
        });
    };

    // Fetch inventory on load
    useEffect(() => {
        getInventory()
    }, []);

    // Handle data
    const handleData = (item: string, value: string | number, method: "add" | "update") => {
        method === "add" ? setNewInventory({...newInventory, [item]: value}) : setUpdateInventory({...updateInventory, [item]: value})
    };

    // Handle submit
    const handleSubmit = async (e: any, method: "add" | "update" | "delete", data: InventoryObj) => {
        e.preventDefault();
        const itemPath = `${endpoints["inventory"]}${slugify(String(data.id) ?? "")}/`;
        switch (method) {
            case "delete":
                await props.dataAPI.delete( itemPath,
                ).then(() => {
                    console.log(`Successfully deleted ${data.ingredient}`);
                    setUpdateItem(!updateItem);
                    getInventory();
                }).catch((error: AxiosError) => 
                    console.log(error)
                );
                break;
            case "add":
                await props.dataAPI.post(
                    `${endpoints["inventory"]}`, {
                        ingredient: newInventory.ingredient,
                        quantity: newInventory.quantity,
                        unit_price: newInventory.unit_price,
                    }).then(() => {
                        setAddItem(!addItem);
                        getInventory();
                    }).catch((error: AxiosError) => {
                        console.log(error);
                    });
                break;
            case "update":
                await props.dataAPI.patch(itemPath, {
                    quantity: updateInventory.quantity,
                    unit_price: updateInventory.unit_price,
                }).then(() => {
                    setUpdateItem(!updateItem);
                    getInventory();
                }).catch((error: AxiosError) => {
                    console.log(error);
                })
                break;
            default:
                console.log("Unrecognised method");  
        }  

    };

    return (
        <Container className={`inventory ${ useContext(ThemeContext) }`}>
            <Row className='title'>
                <h2>Inventory</h2>
            </Row>

            <Row className='actions'>
                <Button onClick={() => setAddItem(!addItem)}>Add Item +</Button>
            </Row>

            <InventoryForm
                handleSubmit={handleSubmit}
                handleData={handleData}
                newInventory={newInventory}
                addItem={addItem}
                onHide={() => setAddItem(false)}
                theme={ props.theme }
            />

            <Row xs={1} md={2} lg={3}>
                { inventory.map((item, i) => {
                    return (
                        <Col key={`inventory-item-${i}`}>
                            <Card.Body onClick={() => {
                                    setUpdateInventory({...inventoryObj, ...item});
                                    setUpdateItem(!updateItem);
                                }}>
                                <Card.Title>{ item.ingredient }</Card.Title>
                                <Card.Img src={ item.image ?? placeholder } />
                                <div className='card-details'>
                                    <Card.Text>Available: { item.quantity }</Card.Text>
                                    <Card.Text>{ `£ ${ item.unit_price }` }</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>

            <InventoryUpdateForm
                handleSubmit={ handleSubmit }
                updateItem={ updateItem }
                onHide={ () => setUpdateItem(false) }
                handleData={ handleData }
                updateInventory={ updateInventory }
                theme={ props.theme }
            />
        </Container>

    )
}

export default Inventory;
