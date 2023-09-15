import { FormModal } from "../../modules/forms";
import { useRef, useState, useContext } from "react";
import { dataAPI } from "../../modules/axiosInstances";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import { EditFieldGroup2, SelectMultiFieldGroup2, InputMultiFieldGroup2 } from "../../modules/formComponents";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ColumnsToRows } from "../../modules/formComponents";
import { OrdersContext } from "./orders";
import Form from "react-bootstrap/Form";
import slugify from "slugify";
import { useParams } from "react-router-dom";

export function OrderCreateForm () {
    
    // Get context values
    const { menu, availabilities } = useContext(OrdersContext);

    // Field states
    const [menuItems, setMenuItems] = useState<Array<number>>([]);
    const quantity = useRef<{[key: string]: number | ""}>({});
    const notes = useRef<HTMLInputElement>(null);

    const submitHandler = () => { 
        return dataAPI.post(externalEndpoints.orders!, {
            notes: notes.current!.value ?? "",
            "menu_items[]": menuItems ?? [],
            "quantity{}": quantity.current,
        }
    )};


    const Availability = (
        <>
            { Object.entries(availabilities).map((item: any, i: number) => {
                return (
                    <Form.Text as="div" className="multi-read-field availability" key={`availability_${i}`}>
                        { item[1] }
                    </Form.Text>
                )
            })}
        </>
    );

    const MenuItems = SelectMultiFieldGroup2({
        name: "menu-items",
        reference: menu, 
        state: menuItems,
        stateSetter: setMenuItems
    });


    const Quantity = InputMultiFieldGroup2({
        name: "quantity",
        reference: menu,  
        items_list: menuItems,
        ref: quantity,
        type: "number",
        feedback: "Quantity must be no more than the availability."
    }, {
        min: 1,
        max: availabilities
    });


    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "notes", 
                        label: "Notes", 
                        type: "text", 
                        ref: notes,
                        defaultValue: "",
                        feedback: "Max character length is 200."
                    }, {
                        maxLength: 200
                    })
                }

                <Container className="multi-input-container">
                    <Row className="headers">
                        <Col xs={6}>Menu Items</Col>
                        <Col xs={3}>Quantity</Col>
                        <Col xs={3}>Availability</Col>
                    </Row>
                    
                    {
                        ColumnsToRows([MenuItems, Quantity, Availability], {xs: [6, 3, 3]})   
                    }
                </Container>
        </>
        )
    };


    return (

        <>
            <FormModal 
                title="Create Order Item"
                Fields={ Fields }
                returnURL={ internalEndpoints.orders! }
                submitRequest={ submitHandler }
                deleteURL={ externalEndpoints.orders! }
            />
        </>

    )
};


export function OrderUpdateForm () {
    
    // Get context values
    const { menu, availabilities, orders } = useContext(OrdersContext);
    const { id }: any = useParams();
    const updateObj = orders[id];

    // Field states
    const [menuItems, setMenuItems] = useState<Array<number>>(updateObj.menu_items ?? []);
    const quantity = useRef<{[key: string]: number | ""}>(updateObj.quantity ?? {});
    const notes = useRef<HTMLInputElement>(null);

    const submitHandler = () => {
        return dataAPI.patch(
            `${ externalEndpoints.orders! }${ slugify(String(updateObj.id)) }/`, 
            {
                notes: notes.current!.value ?? "",
                "menu_items[]": menuItems ?? [],
                "quantity{}": quantity.current,
            }
        )
    };

    const Availability = (
        <>
            { Object.entries(availabilities).map((item: any, i: number) => {
                return (
                    <Form.Text as="div" className="multi-read-field availability" key={`availability_${i}`}>
                        { item[1] }
                    </Form.Text>
                )
            })}
        </>
    );

    const MenuItems = SelectMultiFieldGroup2({
        name: "menu-items",
        reference: menu, 
        state: menuItems,
        stateSetter: setMenuItems
    });


    const Quantity = InputMultiFieldGroup2({
        name: "quantity",
        reference: menu,  
        items_list: menuItems,
        ref: quantity,
        type: "number",
        feedback: "Quantity must be no more than the availability."
    }, {
        min: 1,
        max: availabilities
    });


    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "notes", 
                        label: "Notes", 
                        type: "text", 
                        ref: notes,
                        defaultValue: updateObj.notes,
                        feedback: "Max character length is 200."
                    }, {
                        maxLength: 200
                    })
                }

                <Container className="multi-input-container">
                    <Row className="headers">
                        <Col xs={6}>Menu Items</Col>
                        <Col xs={3}>Quantity</Col>
                        <Col xs={3}>Availability</Col>
                    </Row>
                    
                    {
                        ColumnsToRows([MenuItems, Quantity, Availability], {xs: [6, 3, 3]})   
                    }
                </Container>
        </>
        )
    };


    return (

        <>
            <FormModal 
                title="Update Order"
                Fields={ Fields }
                returnURL={ internalEndpoints.orders! }
                submitRequest={ submitHandler }
                deleteURL={ externalEndpoints.orders! }
            />
        </>

    )
};