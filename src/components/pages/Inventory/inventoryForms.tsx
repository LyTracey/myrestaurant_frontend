import { FormModal } from "../../modules/forms";
import { EditFieldGroup2 } from "../../modules/formComponents";
import { useContext, useRef } from "react";
import { internalEndpoints, externalEndpoints } from "../../../data/endpoints";
import { dataAPI } from "../../modules/axiosInstances";
import { InventoryObj } from "./inventory";
import { InventoryContext } from "./inventory";
import slugify from "slugify";


export function InventoryCreateForm () {

    // Field States
    const ingredient = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const unit_price = useRef<HTMLInputElement>(null);


    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "ingredient", 
                        label: "Ingredient*", 
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
            </>
        )
    };


    return (
        <>
            
            <FormModal
                title="Create Inventory Item"
                Fields={ Fields }
                returnURL={ internalEndpoints.inventory! }
                submitRequest={() => dataAPI.post(
                    externalEndpoints.inventory!,
                    {
                        ingredient: ingredient.current!.value,
                        quantity: quantity.current!.value,
                        unit_price: Number(unit_price.current!.value),
                    }
                )}
                deleteURL={ externalEndpoints.inventory! }
            />
        </>
    )
};


export function InventoryUpdateForm () {

    // Get object being updated
    const { updateObj } : InventoryObj = useContext(InventoryContext);

    // Field States
    const ingredient = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const unit_price = useRef<HTMLInputElement>(null);

    // Submit handler

    const submitHandler = () => { 
        return dataAPI.patch( 
            `${ externalEndpoints.inventory! }${ slugify(updateObj.ingredient.toLowerCase()) }/`, 
            {
                ingredient: ingredient.current!.value,
                quantity: quantity.current!.value,
                unit_price: Number(unit_price.current!.value),
            }
    )};


    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "ingredient", 
                        label: "Ingredient", 
                        ref: ingredient,
                        defaultValue: updateObj.ingredient,
                        feedback: "Required. Max character length is 100."
                    }, {
                        maxLength: 100,
                        required: true,
                        disabled: true,
                        className: "disabled"
                    }) 
                }

                { 
                    EditFieldGroup2({
                        name: "quantity", 
                        label: "Quantity Available *", 
                        type: "number",
                        ref: quantity,
                        defaultValue: updateObj.quantity,
                        feedback: "Required. Minimum is 0."
                    }, {
                        min: 0,
                        required: true
                    }) 
                }

                { 
                    EditFieldGroup2({
                        name: "unit_price", 
                        label: "Unit Price *", 
                        type: "number", 
                        defaultValue: updateObj.unit_price,
                        ref: unit_price,
                        feedback: "Required. Minimum is £0.00."
                    }, {
                        min: 0,
                        required: true,
                        step: 0.01
                    }) 
                }
            </>
        )
    };


    return (
        <>
            
            <FormModal
                title="Create Inventory Item"
                Fields={ Fields }
                returnURL={ internalEndpoints.inventory! }
                submitRequest={ submitHandler }
                deleteURL={ `${ externalEndpoints.inventory! }${ updateObj.ingredient }` }
            />
        </>
    )
};