import { MenuContext } from "./menu";
import { useContext, useState } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router-dom";
import { useForm } from "react-hook-form";
import { dataAPI } from "../../modules/axiosInstances";
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import Modal from "react-bootstrap/Modal";
import { DisplayFeedback } from "../../modules/miscComponents";
import { DeleteAlert } from "../../modules/miscComponents";
import { ErrorMessage } from "@hookform/error-message";

export interface MenuType {
    id?: number | null,
    title: string | null,
    slug: string,
    ingredients: string[],
    units: {[key: string]: number},
    image?: string | null,
    description: string,
    price: number | null,
    available_quantity?: number
};


// Default menu object
export const DEFAULT_MENU = {
    id: null,
    title: "",
    slug: "",
    description: "",
    price: null,
    image: null,
    ingredients: [],
    units: {}
};


function MenuForm () {

    // Get context values
    const { menu, inventory }: any = useContext(MenuContext);
    const { id } = useParams();
    let updateObj = id ? {...menu[id]} : DEFAULT_MENU;
    
    // Change array to input format - fill missing values with false
    updateObj.ingredients = Object.keys(inventory).map((inventoryID: string) => Object.keys(updateObj.ingredients).includes(inventoryID) ? inventoryID : false);

    // Utils
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [showDelete, setShowDelete] = useState<boolean>(false);


    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm<MenuType>({
        defaultValues: {...updateObj}
    });

    const ingredients = watch("ingredients");
    const units = watch("units");

    const submitHandler = handleSubmit(async (data) => {
    
        const requestData = {

            title: data.title,
            description: data.description,
            price: data.price,
            "ingredients[]": ingredients.filter((item: string | boolean): item is string => !!item).map((item: string ) => parseInt(item)),
            "units{}": Object.fromEntries(Object.entries(units).filter((unitsArray: [string, number | undefined]) => !!unitsArray[1])),
        };

        console.log(requestData);

        if (id) {
            await dataAPI.patch(`${ externalEndpoints.menu! }${ data.slug }/`, requestData)
        } else {
            await dataAPI.post(externalEndpoints.menu!, requestData);
        }

        navigate(internalEndpoints.menu!);
        revalidator.revalidate();

    });

    const deleteHandler = async () => {
        const response = await dataAPI.delete(`${ externalEndpoints.menu }${ updateObj.slug }/`);
        console.log(response);

        navigate(internalEndpoints.menu!);
        revalidator.revalidate();
    }


    return (
        <Modal show={ true } onHide={() => navigate(internalEndpoints.menu!)}>
            <Modal.Header closeButton>{ id ? `Update Menu Item ${ updateObj.title }` : "Create Menu Item"}</Modal.Header>
            <Modal.Body>

                <DisplayFeedback />

                {   
                    showDelete && 
                    <DeleteAlert 
                        onClickYes={() => deleteHandler()}
                        onClickCancel={() => setShowDelete(false)} 
                    /> 
                    }

                <form onSubmit={ submitHandler }>
                    <div className="title">
                        <label className="input-label">Title</label>
                        <input {...register("title", {
                            disabled: id ? true : false,
                            required: true,
                            maxLength: {
                                value: 50,
                                message: "The max length is 50 characters."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="title" />
                        </div>
                    </div>

                    <div className="description">
                        <label className="input-label">Description</label>
                        <input {...register("description")} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="description" />
                        </div>
                    </div>

                    <div className="price">
                        <label className="input-label">Price *</label>
                        <input type="number" step="0.01" {...register("price", {
                            required: "Please enter a price.",
                            min: {
                                value: 0,
                                message: "Minimum value is 0.00."
                            }
                        })} />

                        <div className="feedback">
                            <ErrorMessage errors={ errors } name="price" />
                        </div>
                    </div>

                    <div className="ingrdients">
                        {
                            Object.entries(inventory).map((inventoryArray: any, i: number) => {
                                return (
                                    <div key={`ingredients_reference_${i}`}>
                                        <input
                                            id={`menuItem.${i}`}
                                            value={ inventoryArray[0] }
                                            type="checkbox" {...register(
                                                `ingredients.${i}`, 
                                                {
                                                    onChange: (e) => {
                                                        if (!e.target.checked) {
                                                            let newUnits = {...units};
                                                            delete newUnits[inventoryArray[0]];
                                                            setValue("units", newUnits);
                                                        }
                                                    }
                                                }
                                            )}
                                        />
                                        <label className="input-label">{ inventoryArray[1] }</label>
                                    </div>
                                )
                            })
                        }
                    </div>


                    <div className="units">
                        {
                            Object.keys(inventory).map((inventoryID: string) => { 
                                return (
                                    <div key={`units_${ inventoryID }`}>  
                                        <div className="units-input">
                                            {
                                                <input
                                                    type="number" 
                                                        step="0.05"
                                                        {...register(`units.${ inventoryID }`, {
                                                        disabled: !ingredients.includes(inventoryID),
                                                        required: "Please enter a the number of units required.",
                                                        valueAsNumber: true
                                                })} />
                                            }
                                        </div>

                                        <div className="feedback">
                                            <ErrorMessage errors={ errors } name={`units.${ inventoryID }`} />
                                        </div> 
                                    </ div>
                                ) 
                            })
                        }
                    </div>

                    <input type="submit" />
                    <button type="button" onClick={() => setShowDelete(true)}>Delete</button>
                </form>

            </Modal.Body>
        </Modal>
    )

};

export default MenuForm;