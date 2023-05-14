import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { EditFieldGroup, Submit} from '../Forms/formComponents';
import { useState, FormEvent } from 'react';
import "../../styles/form.scss";

function InventoryCreateForm (props: any) {

    // Set states
    const [validated, setValidated] = useState(false);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            props.handleSubmit(e, "add", props.newInventory);
        }
        setValidated(true);
      };

    return (
        <Modal className={`inventory-form form ${ props.theme }`} show={ props.addItem } onHide={() => {
            props.onHide();
            setValidated(false); 
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>New Inventory Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    { 
                        EditFieldGroup({
                            value: props.newInventory.ingredient, 
                            name: "ingredient", 
                            label: "Ingredient*", 
                            type: "text", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true
                        }) 
                    }

                    { 
                        EditFieldGroup({
                            value: props.newInventory.quantity, 
                            name: "quantity", 
                            label: "Quantity Available*", 
                            type: "number", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Minimum is 0."
                        }, {
                            min: 0,
                            required: true
                        }) 
                    }

                    { 
                        EditFieldGroup({
                            value: props.newInventory.unit_price, 
                            name: "unit_price", 
                            label: "Unit Price*", 
                            type: "number", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Minimum is £0.00."
                        }, {
                            min: 0,
                            required: true,
                            step: 0.01
                        }) 
                    }

                    { Submit() }
                </Form>
            </Modal.Body>
        </Modal>
    )

};

export default InventoryCreateForm;