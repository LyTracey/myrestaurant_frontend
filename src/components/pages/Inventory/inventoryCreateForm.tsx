import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { 
    EditFieldGroup2, 
    Submit} from '../../modules/formComponents';
import { useState, FormEvent, useRef } from 'react';
import "../../../styles/form.scss";

function InventoryCreateForm (props: any) {

    // Set states
    const [validated, setValidated] = useState(false);
    const ingredient = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const unit_price = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        props.handleSubmit(e, "add", {
            ingredient: ingredient.current!.value,
            quantity: quantity.current!.value,
            unit_price: Number(unit_price.current!.value),
        }, setValidated);
    };

    return (
        <Modal className={`inventory-form page-form ${ props.theme }`} show={ props.openForm === "add" } onHide={() => {
            props.onHide();
            setValidated(false); 
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>New Inventory Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    { 
                        EditFieldGroup2({
                            name: "ingredient", 
                            label: "Ingredient*", 
                            type: "text", 
                            ref: ingredient,
                            defaultValue: "",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true
                        }) 
                    }

                    { 
                        EditFieldGroup2({
                            name: "quantity", 
                            label: "Quantity Available*", 
                            type: "number",
                            ref: quantity,
                            defaultValue: String(0),
                            feedback: "Required. Minimum is 0."
                        }, {
                            min: 0,
                            required: true
                        }) 
                    }

                    { 
                        EditFieldGroup2({
                            name: "unit_price", 
                            label: "Unit Price*", 
                            type: "number", 
                            defaultValue: String(0),
                            ref: unit_price,
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