import { useForm } from "react-hook-form";
import { GlobalContext } from "../App";
import { dataAPI } from "../../modules/axiosInstances";
import Modal from "react-bootstrap/Modal";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import { OrdersContext } from "./orders";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_ORDER = {
    menu_items: [],
    quantity: {},
    notes: ""
}

interface OrderType {
    menu_items: string[],
    quantity: {[key: string]: number},
    notes: string
}


function OrderForm () {

    // Get context values
    const { feedback: [feedback] } = useContext(GlobalContext);
    const { menu, orders, availabilities }: any = useContext(OrdersContext);
    const { id } = useParams();
    let updateObj = id ? {...orders[id]} : DEFAULT_ORDER;
    
    // Change array to input format - fill missing values with false
    updateObj.menu_items = Object.keys(menu).map((menuID: string) => updateObj.menu_items.includes(Number(menuID)) ? menuID : false);

    // Utils
    const navigate = useNavigate();


    const { register, handleSubmit, watch, setValue } = useForm<OrderType>({
        defaultValues: {...updateObj}
    });

    const menuItems = watch("menu_items");
    const quantity = watch("quantity");

    const submitHandler = handleSubmit(async (data) => {
    
        const requestData = {
            notes: data.notes,
            "menu_items[]": data.menu_items.filter((item: string | boolean) => item).map((item: string) => parseInt(item)),
            "quantity{}": data.quantity,
        };

        console.log(requestData);

        if (id) {
            await dataAPI.patch(`${ externalEndpoints.orders! }${ id }/`, requestData)
        } else {
            await dataAPI.post(externalEndpoints.orders!, requestData);
        }

        navigate(internalEndpoints.orders!);


    });


    return (
        <Modal show={ true } onHide={() => navigate(internalEndpoints.orders!)}>
            <Modal.Header closeButton>{ id ? `Update Order Item ${ id }` : "Create Order Item"}</Modal.Header>
            <Modal.Body>

                <div className="feedback">
                    <ul>
                        { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                    </ul>
                </div>

                <form onSubmit={ submitHandler }>
                    <div className="notes">
                        <label>Notes</label>
                        <input {...register("notes", {
                            maxLength: {
                                value: 300,
                                message: "The max length is 300 characters."
                            }
                        })} />
                    </div>

                    <div className="menu-items">
                        {
                            Object.entries(menu).map((menuArray: any, i: number) => {
                                return (
                                    <div key={`menuItem.${i}`}>
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
                                        <label htmlFor={`menuItem.${i}`}>{ menuArray[1] } <span>Availability: { availabilities[menuArray[0]] }</span></label>
                                    </div>
                                )
                            })
                        }
                    </div>


                    <div className="quantity">
                        {
                            menuItems.map((menuID: string | boolean, i: number) => { 
                                return (
                                    <div key={`quantity-${i}`}>
                                        {
                                            menuID && <input 
                                                type="number" {...register(`quantity.${ menuID }`, {
                                                valueAsNumber: true
                                            })} />
                                        }
                                    </div>
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