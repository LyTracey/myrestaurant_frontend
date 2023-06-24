import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { 
    ReadFieldGroup,
    EditFieldGroup2, 
    SelectMultiFieldGroup2, 
    InputMultiFieldGroup2, 
    SubmitDelete,
    DeleteAlert, 
    ColumnsToRows } from '../../modules/formComponents';
import Container from "react-bootstrap/Container";
import "../../../styles/form.scss";
import { useState, FormEvent, useRef, useEffect } from 'react';

function MenuUpdateForm (props: any) {

    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [validated, setValidated] = useState(false);
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [ingredients, setIngredients] = useState<Array<number>>([]);
    const units = useRef<{[key: string]: number}>();
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            props.handleSubmit(e, "update", props.updateMenu);
        }
        setValidated(true);
      };

    useEffect(() => {
        setIngredients([...props.updateMenu.current.ingredients]);
        units.current = structuredClone(props.updateMenu.current.units);
        
    }, [props.updateItem]);

    const Ingredients = SelectMultiFieldGroup2({
        name: "ingredients",
        reference: props.ingredients,
        state: ingredients,
        stateSetter: setIngredients
        // label: "Ingredients", 
        // data: props.updateMenu, 
        // values_obj: "units", 
        // items_list: "ingredients÷",
        // setObj: props.setUpdateMenu
    });

    const Units = InputMultiFieldGroup2({
        name: "units",
        reference: props.ingredients, 
        items_list: ingredients,
        ref: units,
        type: "number",
        feedback: "Unit must be greater than 0.01."
        // label: "Units", 
        // data: props.updateMenu, 
        // values_obj: "units", 
        // setObj: props.setupdateMenu,
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
});

    return (
        <Modal className={`menu-form page-form ${ props.theme }`} show={ props.updateItem } onHide={() => {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false); 
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>Update Menu Item: { props.updateMenu.current.title }</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    { 
                        ReadFieldGroup({
                            value: props.updateMenu.current.title, 
                            name: "title", 
                            label: "Title", 
                            type: "text"
                        }) 
                    }

                    { 
                        EditFieldGroup2({
                            name: "description", 
                            label: "Description", 
                            type: "text", 
                            defaultValue: props.updateMenu.current.description,
                            ref: description,
                            feedback: "Max character length is 300."
                            // dataHandler: props.handleData,
                            // method: "update",
                            // value: props.updateMenu.description, 
                        }, {
                            maxLength: 300,
                        }) 
                    }

                    { 
                        EditFieldGroup2({
                            name: "price", 
                            label: "Price*", 
                            type: "number",
                            defaultValue: props.updateMenu.current.price,
                            ref: price,
                            feedback: "Required. Max character length is 100."
                            // method: "update",
                            // dataHandler: props.handleData,
                            // value: props.updateMenu.price, 
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

                    { SubmitDelete(setDeleteAlert) }

                </Form>

                { deleteAlert && DeleteAlert(props.updateMenu, setDeleteAlert, props.handleSubmit) }

            </Modal.Body>
        </Modal>
    )

};

export default MenuUpdateForm;