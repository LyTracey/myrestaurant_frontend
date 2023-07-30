import { 
    useState, 
    useEffect, 
    useContext, 
    useRef,
    useMemo, 
    FormEvent,
    SetStateAction, 
    Dispatch, 
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuCreateForm from './menuCreateForm';
import MenuUpdateForm from './menuUpdateForm';
import Button from 'react-bootstrap/Button';
import { externalEndpoints } from '../../../data/endpoints';
import { AxiosError } from 'axios';
import slugify from 'slugify';
import { ReactComponent as CoffeeCup } from "../../../images/icons/coffee-cup.svg";
import { GlobalContext } from '../../App';
import { submitDataRequest } from '../../../utils/apiUtils';
import { InventoryObj } from '../Inventory/inventory';
import "../../../styles/menu.scss";
import { fetchData } from '../../../utils/apiUtils';

export interface MenuObj {
    id?: number | null,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number | ""},
    image?: string | null,
    description: string,
    price: number | null,
    available_quantity?: number
};


// Default menu object
export const MENU_OBJ = {
    id: null,
    title: "",
    description: "",
    price: null,
    image: null,
    ingredients: [],
    units: {}
};


// Fetch menu data and ingredients data
// function fetchData (setMenu: Dispatch<SetStateAction<Array<MenuObj>>>, setInventory: Dispatch<SetStateAction<Array<InventoryObj>>>) {
//     axios.all([
//         dataAPI.get(`${externalEndpoints["menu"]}`),
//         dataAPI.get(`${externalEndpoints["inventory"]}`)
//     ])
//     .then(axios.spread((menuResponse, inventoryResponse) => {
//         setMenu(menuResponse.data);
//         setInventory(inventoryResponse.data);
//     }))
//     .catch(axios.spread((menuError, inventoryError) => {
//         console.log(menuError);
//         console.log(inventoryError);
//     }))  
// };


function Menu ( ) {
    
    // External data states
    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    const [inventory, setInventory] = useState<Array<InventoryObj>>([]);


    // Form states
    const [openForm, setOpenForm] = useState<"add" | "update" | "none">("none")
    const { theme: [theme], isStaff: [isStaff], role: [role] } = useContext(GlobalContext);
    const updateMenu = useRef<MenuObj>(structuredClone(MENU_OBJ));


    // Fetch menu and invenotry data on load
    useEffect(() => {
        fetchData(externalEndpoints["menu"]!, (response) => setMenu(response.data));
        fetchData(externalEndpoints["inventory"]!, (response => setInventory(response.data)));
    }, []);
    

    // Filter map invenotry items to an object as id: title key-values when inventory state changes
    const ingredients: {[key: number]: string} = useMemo(() => {
        return Object.fromEntries(inventory.map((ingredient: InventoryObj) => (
            [ingredient.id, ingredient.ingredient]
        )))
    }, [inventory]);


    // Handle submit to backend
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, method: string, data: MenuObj, setValidated: Dispatch<SetStateAction<boolean>>) => {

        await submitDataRequest({
            event: e,
            method: method,
            data: data,
            url: method === "add" ? `${externalEndpoints["menu"]}` : `${externalEndpoints["menu"]}${slugify(data.title ?? "")}/`,
            resolve: () => {
                setOpenForm("none");
                fetchData(externalEndpoints["menu"]!, (response) => setMenu(response.data));
                fetchData(externalEndpoints["inventory"]!, (response => setInventory(response.data)));
            },
            reject: (error: AxiosError) => console.log(error),
            setValidated: setValidated
        })
    };

    return (
        <Container className={`page menu ${ theme }`}>
            <Row className='title'>
                <h2>Menu</h2>
            </Row>

            {
                (isStaff && ["MANAGER", "CHEF"].includes(role)) &&
                <Row xs={2} className='actions'>
                    <Button className="add" onClick={() =>
                        setOpenForm("add")
                    }>Add Item +</Button>
                </Row>
            }

            <MenuCreateForm
                theme={ theme }
                openForm={ openForm }
                onHide={() => setOpenForm("none")}
                handleSubmit={ handleSubmit }
                ingredients={ ingredients }
            />

            <MenuUpdateForm
                theme={ theme }
                openForm={ openForm }
                onHide={ () => setOpenForm("none") }
                handleSubmit={ handleSubmit }
                ingredients={ ingredients } 
                updateMenu={ updateMenu }
            />

            <Row xs={1} md={2} lg={3}>
                { menu.map((item, i) => {
                    return (
                        <Col key={`menu-item-${i}`}>
                            <Card.Body onClick={() => {
                                    // Only render update form if user isStaff and has a role of MANAGER | CHEF
                                    if (isStaff && ["MANAGER", "CHEF"].includes(role)) {       
                                        updateMenu.current = {...MENU_OBJ, ...item};
                                        setOpenForm("update");
                                    }
                                }} className={!isStaff ? "default-cursor" : ""}>
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

        </Container>
    )
};


export default Menu;