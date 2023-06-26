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
    DeleteAlert2, 
    ColumnsToRows } from '../../modules/formComponents';
import Container from "react-bootstrap/Container";
import "../../../styles/form.scss";
import { useState, useRef, useEffect, FormEvent, MouseEvent } from 'react';

function MenuUpdateForm (props: any) {

    // Form states
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [validated, setValidated] = useState<boolean>(false);

    // Input field states
    const description = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const [ingredients, setIngredients] = useState<Array<number>>([]);
    const units = useRef<{[key: string]: number}>({});


    const handleSubmit = (e: FormEvent<HTMLFormElement> |  MouseEvent<HTMLElement>, method: "update" | "delete") => {
        props.handleSubmit(e, method, {
            title: props.updateMenu.current.title ,
            description: description.current!.value,
            price: Number(price.current!.value),
            "ingredients[]": ingredients,
            "units{}": units.current
        }, setValidated);
    };


    // Reset ingredients and units states when update dialogue is opened
    useEffect(() => {
        if (props.openForm === "update" ) {
            setIngredients([...props.updateMenu.current.ingredients]);
            units.current = structuredClone(props.updateMenu.current.units);
        }
    }, [props.openForm]);


    const Ingredients = SelectMultiFieldGroup2({
        name: "ingredients",
        reference: props.ingredients,
        state: ingredients,
        stateSetter: setIngredients
    });

    const Units = InputMultiFieldGroup2({
        name: "units",
        reference: props.ingredients, 
        items_list: ingredients,
        ref: units,
        type: "number",
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
});

    return (
        <Modal className={`menu-form page-form ${ props.theme }`} show={ props.openForm === "update" } onHide={() => {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false); 
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>Update Menu Item: { props.updateMenu.current.title }</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e, "update")}>
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

                { deleteAlert && DeleteAlert2(
                    (e: MouseEvent<HTMLElement>) => handleSubmit(e, "delete"),
                    () => setDeleteAlert(false) 
                )}

            </Modal.Body>
        </Modal>
    )

};

export default MenuUpdateForm;