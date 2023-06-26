import { FormEvent, useState, useRef, MouseEvent } from "react";
import '../../../styles/form.scss';
import Modal from "react-bootstrap/Modal";
import { 
    EditFieldGroup2, 
    DeleteAlert2, 
    SubmitDelete } from "../../modules/formComponents";
import Form from "react-bootstrap/Form";

function InventoryUpdateForm (props: any) {

    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [validated, setValidated] = useState(false);

    // Input field states
    const ingredient = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const unitPrice = useRef<HTMLInputElement>(null);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>, method: "update" | "delete") => {
        props.handleSubmit(e, method, {
            id: props.updateInventory.current.id,
            ingredient: ingredient.current!.value,
            quantity: quantity.current!.value,
            unit_price: Number(unitPrice.current!.value),
        }, setValidated);
    };
    

    return (
        <Modal className={`inventory-form page-form ${ props.theme }`} show={ props.openForm === "update" } onHide={() => {
                setDeleteAlert(false);
                props.onHide();
                setValidated(false); 
            }}>

            <Modal.Header closeButton>
                <Modal.Title>Update Inventory Item: { props.updateInventory.current.ingredient }</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e, "update")}>
                    
                    { 
                        EditFieldGroup2({
                            name: "ingredient", 
                            label: "Ingredient*", 
                            type: "text", 
                            defaultValue: props.updateInventory.current.ingredient,
                            ref: ingredient,
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
                            defaultValue: props.updateInventory.current.quantity,
                            ref: quantity,
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
                            defaultValue: props.updateInventory.current.unit_price,
                            ref: unitPrice,
                            feedback: "Required. Minimum is £0.00."
                        }, {
                            min: 0,
                            required: true,
                            step: 0.01
                        }) 
                    }
                    

                        
                    { SubmitDelete(setDeleteAlert) }

                </Form>

                { deleteAlert && DeleteAlert2(
                    (e: MouseEvent<HTMLElement>) => handleSubmit(e, "delete"),
                    () => setDeleteAlert(false)
                )}
            </Modal.Body>
        </ Modal>
    )
};

export default InventoryUpdateForm;