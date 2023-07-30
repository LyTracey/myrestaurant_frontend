import FormModal from "../../modules/modal";
import { EditFieldGroup2 } from "../../modules/formComponents";
import { useRef } from "react";
import { internalEndpoints, externalEndpoints } from "../../../data/endpoints";
import { dataAPI } from "../../App";


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
            </>
        )
    };


    return (
        <>
            
            <FormModal
                title="Create Inventory Item"
                Fields={ Fields }
                returnURL={ internalEndpoints["inventoryCreate"]! }
                submitRequest={() => dataAPI.post(
                    externalEndpoints["inventory"]!,
                    {
                        ingredient: ingredient.current!.value,
                        quantity: quantity.current!.value,
                        unit_price: Number(unit_price.current!.value),
                    }
                )}
            />
        </>
    )
}