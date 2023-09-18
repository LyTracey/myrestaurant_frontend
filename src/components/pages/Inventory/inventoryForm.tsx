import { InventoryContext } from "./inventory";
import { useContext, useState } from "react";
import { useParams, useNavigate, useRevalidator } from "react-router-dom";
import { useForm } from "react-hook-form";
import { dataAPI } from "../../modules/axiosInstances";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import Modal from "react-bootstrap/Modal";
import { DisplayFeedback } from "../../modules/miscComponents";
import { ErrorMessage } from "@hookform/error-message";
import { DeleteAlert } from "../../modules/miscComponents";
import { GlobalContext } from "../App";
import ICONS from "../../../data/icons";

export interface InventoryType {
    [index: string]: any,
    id?: number | null,
    ingredient: string,
    slug: string,
    quantity: string,
    unit_price: string | null,
    threshold: number
};

export const DEFAULT_INVENTORY = {
    id: null,
    ingredient: "",
    slug: "",
    quantity: "",
    unit_price: "",
    threshold: 10
};


function InventoryForm () {

    // Get context values
    const { theme: [theme] } = useContext(GlobalContext);
    const { inventory }: any = useContext(InventoryContext);
    const { id } = useParams();
    let updateObj = id ? {...inventory[id]} : DEFAULT_INVENTORY;
   
    // Utils
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const { DeleteIcon } = ICONS;

    // Initialise form
    const { register, formState: { errors }, handleSubmit } = useForm<InventoryType>({
        defaultValues: {...updateObj}
    });

    // Handlers
    const submitHandler = handleSubmit(async (data) => {
    
        const requestData = {
            ingredient: data.ingredient,
            quantity: data.quantity,
            unit_price: data.unit_price,
            threshold: data.threshold
        };

        console.log(requestData);

        if (id) {
            await dataAPI.patch(`${ externalEndpoints.inventory! }${ data.slug }/`, requestData)
        } else {
            await dataAPI.post(externalEndpoints.inventory!, requestData);
        }

        navigate(internalEndpoints.inventory!);
        revalidator.revalidate();

    });

    const deleteHandler = async () => {
        const response = await dataAPI.delete(`${ externalEndpoints.inventory }${ updateObj.slug }/`);
        console.log(response);

        navigate(internalEndpoints.inventory!);
        revalidator.revalidate();
    }


    return (
        <Modal className={ theme } show={ true } onHide={() => navigate(internalEndpoints.inventory!)}>
            <Modal.Header closeButton>
                <h3 className="title">
                    { id ? `Update Inventory Item ${ updateObj.ingredient }` : "Create Inventory Item"}
                </h3>
            </Modal.Header>
            <Modal.Body>

                <DisplayFeedback />

                {   
                    showDelete && 
                    <DeleteAlert 
                        onClickYes={() => deleteHandler()}
                        onClickCancel={() => setShowDelete(false)} 
                    /> 
                }
                
                {   id &&
                    <div className="actions">
                        <button type="button" className="button delete" onClick={() => setShowDelete(true)}><DeleteIcon /> Delete</button>
                    </div>
                
                }

                <form onSubmit={ submitHandler }>
                    <div className="ingredient">
                        <label className="input-label">Ingredient</label>
                        <input {...register("ingredient", {
                            disabled: id ? true : false,
                            required: true,
                            maxLength: {
                                value: 50,
                                message: "The max length is 50 characters."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="ingredient" />
                        </div>
                    </div>

                    <div className="quantity">
                        <label className="input-label">Quantity *</label>
                        <input type="number" step="0.5" {...register("quantity", {
                            required: "Please enter the available quantity.",
                            min: {
                                value: 0,
                                message: "Minimum value is 0."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="quantity" />
                        </div>
                    </div>

                    <div className="unit_price">
                        <label className="input-label">Unit Price *</label>
                        <input type="number" step="0.01" {...register("unit_price", {
                            required: "Please enter the price for a unit of this ingredient.",
                            min: {
                                value: 0,
                                message: "Minimum value is 0.00."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="unit_price" />
                        </div>
                    </div>


                    <div className="threshold">
                        <label className="input-label">Threshold</label>
                        <input 
                            type="number" 
                            title={`This is the value used to determine whether the ingredient is low in stock. The default is 10.`} 
                            step="0.5" 
                            {...register("threshold", {  
                            min: {
                                value: 0,
                                message: "Minimum value is 0."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="threshold" />
                        </div>
                    </div>

                    <button type="submit" className="button submit">Submit</ button>
                </form>

            </Modal.Body>
        </Modal>
    )

};

export default InventoryForm;