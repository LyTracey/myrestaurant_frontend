import { FormModal } from "../../modules/forms";
import { useRef, useState, useContext } from "react";
import { dataAPI } from "../App";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import { EditFieldGroup2, SelectMultiFieldGroup2, InputMultiFieldGroup2 } from "../../modules/formComponents";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ColumnsToRows } from "../../modules/formComponents";
import { MenuContext } from "./menu";
import slugify from "slugify";

export function MenuCreateForm () {
    
    // Get context values
    const { inventory } = useContext(MenuContext);

    // Field states
    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [ingredients, setIngredients] = useState<Array<number>>([]);
    const units = useRef<{[key: string]: number}>({});

    const Ingredients = SelectMultiFieldGroup2({
        name: "ingredients",
        reference: inventory, 
        state: ingredients,
        stateSetter: setIngredients
    });

    const Units = InputMultiFieldGroup2({
        name: "units", 
        reference: inventory,
        items_list: ingredients,
        ref: units,
        type: "number",
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
    });


    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "title", 
                        label: "Title*", 
                        type: "text", 
                        ref: title,
                        defaultValue: "",
                        feedback: "Required. Max character length is 100."
                    }, {
                        maxLength: 100,
                        required: true
                    }) 
                }

                { 
                    EditFieldGroup2({
                        name: "description", 
                        label: "Description", 
                        type: "text",
                        defaultValue: "",
                        ref: description,
                        feedback: "Max character length is 300."
                    }, {
                        maxLength: 300,
                    }) 
                }

                { 
                    EditFieldGroup2({
                        name: "price", 
                        label: "Price*", 
                        type: "number", 
                        defaultValue: String(0),
                        ref: price,
                        feedback: "Required. Max character length is 100."
                    }, {
                        maxLength: 100,
                        required: true,
                        min: 0,
                        step: "0.01"
                    }) 
                }
                <Container className="multi-input-container">
                    <Row className="headers">
                        <Col xs={6}>Ingredients</Col>
                        <Col xs={6}>Units</Col>
                    </Row>

                    { ColumnsToRows([Ingredients, Units], {xs: [6, 6]}) }
                </Container>
            </>
        )
    };


    return (

        <>
            <FormModal 
                title="Create Menu Item"
                Fields={ Fields }
                returnURL={ internalEndpoints.menu! }
                submitRequest={() => { return dataAPI.post(externalEndpoints.menu!, {
                    title: title.current!.value,
                    description: description.current!.value,
                    price: Number(price.current!.value),
                    "ingredients[]": ingredients,
                    "units{}": units.current})
                }}
                deleteURL={ externalEndpoints.menu! }
            />
        </>

    )
};


export function MenuUpdateForm () {
    
    // Get context values
    const { inventory, updateObj } = useContext(MenuContext);

    // Field states
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [ingredients, setIngredients] = useState<Array<number>>([]);
    const units = useRef<{[key: string]: number}>({});

    const Ingredients = SelectMultiFieldGroup2({
        name: "ingredients",
        reference: inventory, 
        state: ingredients,
        stateSetter: setIngredients
    });

    const Units = InputMultiFieldGroup2({
        name: "units", 
        reference: inventory,
        items_list: ingredients,
        ref: units,
        type: "number",
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
    });


    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "description", 
                        label: "Description", 
                        type: "text",
                        defaultValue: updateObj.description,
                        ref: description,
                        feedback: "Max character length is 300."
                    }, {
                        maxLength: 300,
                    }) 
                }

                { 
                    EditFieldGroup2({
                        name: "price", 
                        label: "Price*", 
                        type: "number", 
                        defaultValue: updateObj.price,
                        ref: price,
                        feedback: "Required. Max character length is 100."
                    }, {
                        maxLength: 100,
                        required: true,
                        min: 0,
                        step: "0.01"
                    }) 
                }
                <Container className="multi-input-container">
                    <Row className="headers">
                        <Col xs={6}>Ingredients</Col>
                        <Col xs={6}>Units</Col>
                    </Row>

                    { ColumnsToRows([Ingredients, Units], {xs: [6, 6]}) }
                </Container>
            </>
        )
    };


    return (

        <>
            <FormModal 
                title="Create Menu Item"
                Fields={ Fields }
                returnURL={ internalEndpoints.menu! }
                submitRequest={() => { return dataAPI.patch(
                    `${ externalEndpoints.menu! }/${ slugify(updateObj.title) }`, 
                    {
                        title: updateObj.title,
                        description: description.current!.value,
                        price: Number(price.current!.value),
                        "ingredients[]": ingredients,
                        "units{}": units.current
                    }
                )}}
                deleteURL={ externalEndpoints.menu! }
            />
        </>

    )
}