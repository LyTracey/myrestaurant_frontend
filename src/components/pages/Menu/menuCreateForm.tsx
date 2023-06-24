import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { 
    EditFieldGroup2, 
    SelectMultiFieldGroup2, 
    InputMultiFieldGroup2, 
    Submit, 
    ColumnsToRows } from '../../modules/formComponents';
import Container from "react-bootstrap/Container";
import "../../../styles/form.scss";
import { useState, FormEvent, useRef, useEffect } from 'react';

function MenuCreateForm (props: any) {

    // Set states
    const [validated, setValidated] = useState(false);
    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [ingredients, setIngredients] = useState<Array<number>>([]);
    const units = useRef<{[key: string]: number}>({});

    useEffect(() => setIngredients([]), [props.addItem]);

    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;

        console.log(title.current)
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            // const newNewMenu = {...props.newMenu, description: description.current}
            props.handleSubmit(e, "add", {
                title: title.current!.value,
                description: description.current!.value,
                price: Number(price.current!.value),
                ingredients: ingredients,
                units: units.current
            });
        }
        setValidated(true);
      };
      
      const Ingredients = SelectMultiFieldGroup2({
        name: "ingredients",
        reference: props.ingredients, 
        state: ingredients,
        stateSetter: setIngredients
        // label: "Ingredients",
        // values_obj: "units", 
        // items_list: "ingredients",
        // data: props.newMenu, 
        // setObj: props.setNewMenu
    });

    const Units = InputMultiFieldGroup2({
        name: "units", 
        reference: props.ingredients, 
        items_list: ingredients,
        ref: units,
        type: "number",
        feedback: "Unit must be greater than 0.01."
        // data: props.newMenu,
        // values_obj: "units", 
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
});

    return (
        <Modal className={`menu-form page-form ${ props.theme }`} show={ props.addItem } onHide={() => {
            props.onHide();
            setValidated(false); 
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>New Menu Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    { 
                        EditFieldGroup2({
                            // value: props.newMenu.title, 
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
                            // value: props.newMenu.description, 
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
                            // value: props.newMenu.price, 
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

                    { Submit() }
                </Form>
            </Modal.Body>
        </Modal>
    )

};

export default MenuCreateForm;