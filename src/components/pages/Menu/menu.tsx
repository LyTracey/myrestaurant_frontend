import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuCreateForm from './menuCreateForm';
import MenuUpdateForm from './menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../../../data/endpoints';
import "../../../styles/menu.scss";
import slugify from 'slugify';
import { ReactComponent as CoffeeCup } from "../../../images/icons/coffee-cup.svg";
import { useContext, useMemo, SetStateAction, Dispatch, useRef } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
import { submitDataRequest } from '../../../utils/baseUtils';
import { InventoryObj} from '../Inventory/inventory';
import axios from "axios";

interface MenuObj {
    [index: string]: any,
    id?: number | null,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number | ""},
    image?: string | null,
    description: string,
    price: number | null,
    available_quantity?: number
};

interface IngredientsObj {
    [key: number]: any
};

export function fetchData (setMenu: Dispatch<SetStateAction<Array<MenuObj>>>, setInventory: Dispatch<SetStateAction<Array<InventoryObj>>>) {
    // Fetch menu data and ingredients data on render
    axios.all([
        dataAPI.get(`${endpoints["menu"]}`),
        dataAPI.get(`${endpoints["inventory"]}`)
    ])
    .then(axios.spread((menuResponse, inventoryResponse) => {
        setMenu(menuResponse.data);
        setInventory(inventoryResponse.data);
    }))
    .catch(axios.spread((menuError, inventoryError) => {
        console.log(menuError);
        console.log(inventoryError);
    }))    
};

// Set states
const menuObj = {
    id: null,
    title: "",
    description: "",
    price: null,
    image: null,
    ingredients: [],
    units: {}
};

function Menu ( props: any ) {

    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    // const [ingredients, setIngredients] = useState<IngredientsObj>({});
    const [inventory, setInventory] = useState<Array<InventoryObj>>([]);
    // const [newMenu, setNewMenu] = useState<MenuObj>(menuObj);
    const [addItem, setAddItem] = useState<boolean>(false);
    // const [updateMenu, setUpdateMenu ] = useState<MenuObj>(menuObj);
    const updateMenu = useRef<MenuObj>(structuredClone(menuObj));
    const [updateItem, setUpdateItem] = useState<boolean>(false);
    const theme = useContext(ThemeContext);


    useEffect(() => fetchData(setMenu, setInventory), []);
    
    const ingredients: IngredientsObj = useMemo(() => {
        // Return object of id as key and ingredient as value fields for each inventory item
        return Object.fromEntries(inventory.map((ingredient: InventoryObj) => (
            [ingredient.id, ingredient.ingredient]
        )))
    }, [inventory]);
    

    // // Update newMenu state
    // const handleData = (item: string, value: string | number, method: "add" | "update") => {
    //     method === "add" ? setNewMenu({...newMenu, [item]: value}) : setUpdateMenu({...updateMenu, [item]: value})
    // };

    // Handle submit to backend
    const handleSubmit = async (e: Event, method: string, data: MenuObj) => {
        let dataObj = {
            ...(method === "add" && { title: data.title }),
            description: data.description,
            price: data.price,
            "ingredients[]": data.ingredients,
            "units{}": data.units
        };

        await submitDataRequest({
            event: e,
            method: method,
            data: dataObj,
            url: method === "add" ? `${endpoints["menu"]}` : `${endpoints["menu"]}${slugify(data.title ?? "")}/`,
            resolve: () => {
                setAddItem(false);
                setUpdateItem(false);
                fetchData(setMenu, setInventory);
            },
            reject: (error: AxiosError) => console.log(error) 
        })  
    };

    return (
        <Container className={`menu ${ useContext(ThemeContext) }`}>
            <Row className='title'>
                <h2>Menu</h2>
            </Row>

            {
                (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) &&
                <Row xs={2} className='actions'>
                    <Button className="add" onClick={() => {
                        // setNewMenu({...menuObj});
                        setAddItem(!addItem);
                    }}>Add Item +</Button>
                </Row>
            }

            <MenuCreateForm
                theme={ theme }
                addItem={ addItem }
                onHide={() => setAddItem(false)}
                handleSubmit={ handleSubmit }
                // newMenu={ newMenu }
                // setNewMenu={ setNewMenu }
                // handleData={ handleData }
                ingredients={ ingredients }
            />

            <Row xs={1} md={2} lg={3}>
                { menu.map((item, i) => {
                    return (
                        <Col key={`menu-item-${i}`}>
                            <Card.Body onClick={() => {
                                    if (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) {        // Only render update form if user isStaff and has a role of MANAGER | CHEF
                                        updateMenu.current = {...menuObj, ...item};
                                        setUpdateItem(!updateItem);
                                    }
                                }} className={!props.isStaff ? "default-cursor" : ""}>
                                <Card.Title>{ item.title }</Card.Title>
                                <CoffeeCup className="icon" />
                                <div className='card-details'>
                                    <Card.Text>{ item.description }</Card.Text>
                                    <Card.Text>{ `£ ${ item.price }` }</Card.Text>
                                    <Card.Text>Ingredients: { item.ingredients.map(i => ingredients[i] ).join(", ") }</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>

            <MenuUpdateForm
                updateItem={ updateItem }
                onHide={ () => setUpdateItem(false) }
                handleSubmit={ handleSubmit }
                theme={ theme }
                ingredients={ ingredients } 
                updateMenu={ updateMenu }
                // handleData={ handleData }
                // setUpdateMenu={ setUpdateMenu }
            />
        </Container>
    )
};


export default Menu;