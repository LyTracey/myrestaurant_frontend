import { useForm } from "react-hook-form";
import { dataAPI } from "../../modules/axiosInstances";
import Modal from "react-bootstrap/Modal";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import { OrdersContext } from "./orders";
import { useContext, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { DisplayFeedback } from "../../modules/miscComponents";
import Form from "react-bootstrap/Form";
import { GlobalContext } from "../App";
import { DeleteAlert } from "../../modules/miscComponents";
import ICONS from "../../../data/icons";
import "../../../styles/forms.scss";

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
    const { theme } = useContext(GlobalContext);
    const { menu, orders, availabilities }: any = useContext(OrdersContext);
    const { id } = useParams();
    let updateObj = id ? {...orders[id]} : DEFAULT_ORDER;
    
    // Change array to input format - fill missing values with false
    updateObj.menu_items = Object.keys(menu).map((menuID: string) => updateObj.menu_items.includes(Number(menuID)) ? menuID : false);

    // Utils
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const { DeleteIcon } = ICONS;


    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm<OrderType>({
        defaultValues: {...updateObj}
    });

    // States
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const menuItems = watch("menu_items");
    const quantity = watch("quantity");

    const submitHandler = handleSubmit(async (data) => {
    
        const requestData = {
            notes: data.notes,
            "menu_items[]": data.menu_items.filter((item: string | boolean): item is string => !!item).map((item: string ) => parseInt(item)),
            "quantity{}": Object.fromEntries(Object.entries(data.quantity).filter((quantityArray: [string, number | undefined]) => !!quantityArray[1])),
        };

        if (id) {
            await dataAPI.patch(`${ externalEndpoints.orders! }${ id }/`, requestData)
        } else {
            await dataAPI.post(externalEndpoints.orders!, requestData);
        }

        navigate(internalEndpoints.orders!);
        revalidator.revalidate();

    });

    const deleteHandler = async () => {
        await dataAPI.delete(`${ externalEndpoints.menu }${ updateObj.slug }/`);

        navigate(internalEndpoints.menu!);
        revalidator.revalidate();
    }


    return (
        <Modal className={ theme } show={ true } onHide={() => navigate(internalEndpoints.orders!)}>
            <Modal.Header closeButton>
                <h3 className="title">
                    { id ? `Update Order Item ${ id }` : "Create Order Item"}
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

                {
                    id && 
                    <div className="actions">
                        <button title="Delete order item" type="button" className="button delete" onClick={() => setShowDelete(true)}>
                            <DeleteIcon /> Delete
                        </button>
                    </div>
                }

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
                    
                    <div className="multi-input">
                        <div className="menu-items">
                            <label>Menu Items</label>
                            {
                                Object.entries(menu).map((menuArray: any, i: number) => {
                                    return (
                                        <div className="check-input-container" key={`menu_reference_${i}`}>
                                            <Form.Check
                                                className="check-input"
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
                                            <Form.Label className="input-label check-label">{ menuArray[1] }</Form.Label>
                                            <span className="availability">Availability: { availabilities[menuArray[0]] }</span>
                                        </div>
                                    )
                                })
                            }
                        </div>


                        <div className="quantity">
                            <label>Quantity</label>
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
                    </div>

                    <button type="submit" className="button submit">Submit</ button>
                </form>

            </Modal.Body>
        </Modal>
    )

};

export default OrderForm;