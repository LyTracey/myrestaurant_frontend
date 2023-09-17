import { useForm } from "react-hook-form";
import { dataAPI } from "../../modules/axiosInstances";
import Modal from "react-bootstrap/Modal";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import { OrdersContext } from "./orders";
import { useContext } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { DisplayFeedback } from "../../modules/miscComponents";

const DEFAULT_ORDER = {
    menu_items: [],
    quantity: {},
    notes: ""
}

interface OrderType {
    menu_items: Array<string | boolean>,
    quantity: {[key: string]: number},
    notes: string
}


function OrderForm () {

    // Get context values
    const { menu, orders, availabilities }: any = useContext(OrdersContext);
    const { id } = useParams();
    let updateObj = id ? {...orders[id]} : DEFAULT_ORDER;
    
    // Change array to input format - fill missing values with false
    updateObj.menu_items = Object.keys(menu).map((menuID: string) => updateObj.menu_items.includes(Number(menuID)) ? menuID : false);

    // Utils
    const navigate = useNavigate();
    const revalidator = useRevalidator();


    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm<OrderType>({
        defaultValues: {...updateObj}
    });

    const menuItems = watch("menu_items");
    const quantity = watch("quantity");

    const submitHandler = handleSubmit(async (data) => {
    
        const requestData = {
            notes: data.notes,
            "menu_items[]": data.menu_items.filter((item: string | boolean): item is string => !!item).map((item: string ) => parseInt(item)),
            "quantity{}": Object.fromEntries(Object.entries(data.quantity).filter((quantityArray: [string, number | undefined]) => !!quantityArray[1])),
        };

        console.log(requestData);

        if (id) {
            await dataAPI.patch(`${ externalEndpoints.orders! }${ id }/`, requestData)
        } else {
            await dataAPI.post(externalEndpoints.orders!, requestData);
        }

        navigate(internalEndpoints.orders!);
        revalidator.revalidate();

    });


    return (
        <Modal show={ true } onHide={() => navigate(internalEndpoints.orders!)}>
            <Modal.Header closeButton>{ id ? `Update Order Item ${ id }` : "Create Order Item"}</Modal.Header>
            <Modal.Body>

                <DisplayFeedback />

                <form onSubmit={ submitHandler }>
                    <div className="notes">
                        <label className="input-label">Notes </label>
                        <input {...register("notes", {
                            maxLength: {
                                value: 300,
                                message: "The max length is 300 characters."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="notes" />
                        </div>
                    </div>

                    <div className="menu-items">
                        {
                            Object.entries(menu).map((menuArray: any, i: number) => {
                                return (
                                    <div key={`menu_reference_${i}`}>
                                        <input
                                            id={`menuItem.${i}`}
                                            value={ menuArray[0] }
                                            type="checkbox" {...register(
                                                `menu_items.${i}`, 
                                                {
                                                    onChange: (e) => {
                                                        if (!e.target.checked) {
                                                            let newQuantity = {...quantity};
                                                            delete newQuantity[menuArray[0]];
                                                            setValue("quantity", newQuantity);
                                                        }
                                                    }
                                                }
                                            )}
                                        />
                                        <label className="input-label">{ menuArray[1] }</label>
                                        <span>Availability: { availabilities[menuArray[0]] }</span>
                                    </div>
                                )
                            })
                        }
                    </div>


                    <div className="quantity">
                        {
                            Object.keys(menu).map((menuID: string) => { 
                                return (
                                    <div key={`quantity_${ menuID }`}>  
                                        <div className="quantity-input">
                                            {
                                                menuID && <input
                                                    type="number" {...register(`quantity.${ menuID }`, {
                                                        disabled: !menuItems.includes(menuID),
                                                        required: "Please enter a quantity.",
                                                        valueAsNumber: true
                                                })} />
                                            }
                                        </div>

                                        <div className="feedback">
                                            <ErrorMessage errors={ errors } name={`quantity.${ menuID }`} />
                                        </div> 
                                    </ div>
                                ) 
                            })
                        }
                    </div>

                    <input type="submit" />
                </form>

            </Modal.Body>
        </Modal>
    )

};

export default OrderForm;