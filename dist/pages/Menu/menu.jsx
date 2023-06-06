import { __awaiter } from "tslib";
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuCreateForm from './menuCreateForm';
import MenuUpdateForm from './menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/menu.scss";
import slugify from 'slugify';
import { ReactComponent as CoffeeCup } from "../../images/icons/coffee-cup.svg";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
;
;
function Menu(props) {
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
    const [menu, setMenu] = useState([]);
    const [ingredients, setIngredients] = useState({});
    const [newMenu, setNewMenu] = useState(menuObj);
    const [addItem, setAddItem] = useState(false);
    const [updateMenu, setUpdateMenu] = useState(menuObj);
    const [updateItem, setUpdateItem] = useState(false);
    const theme = useContext(ThemeContext);
    // Fetch menu data from backend
    const getMenu = () => {
        dataAPI.get(`${endpoints["menu"]}`).then((response) => {
            setMenu(response.data);
        }).catch((error) => console.log(error));
    };
    // Fetch ingredients from backend
    const getIngredients = () => {
        dataAPI.get(`${endpoints["inventory"]}`).then((response) => {
            const filteredInventory = {};
            // Return object of id as key and ingredient as value fields for each inventory item
            response.data.forEach((item) => (filteredInventory[item.id] = { title: item.ingredient }));
            setIngredients(filteredInventory);
        }).catch((error) => console.log(error));
    };
    // Fetch menu data and ingredients data on first load
    useEffect(() => {
        getMenu();
        getIngredients();
    }, []);
    // Update newMenu state
    const handleData = (item, value, method) => {
        method === "add" ? setNewMenu(Object.assign(Object.assign({}, newMenu), { [item]: value })) : setUpdateMenu(Object.assign(Object.assign({}, updateMenu), { [item]: value }));
    };
    // Handle submit multipart form to backend
    const handleSubmit = (e, method, data) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        e.preventDefault();
        const itemPath = `${endpoints["menu"]}${slugify((_a = data.title) !== null && _a !== void 0 ? _a : "")}/`;
        switch (method) {
            case "delete":
                yield dataAPI.delete(itemPath).then(() => {
                    console.log(`Successfully deleted ${data.title}`);
                    setUpdateItem(false);
                    getMenu();
                }).catch((error) => console.log(error));
                break;
            case "add":
                yield dataAPI.post(`${endpoints["menu"]}`, {
                    title: newMenu.title,
                    description: newMenu.description,
                    price: newMenu.price,
                    "ingredients[]": newMenu.ingredients,
                    "units{}": newMenu.units
                }).then(() => {
                    setAddItem(false);
                    getMenu();
                }).catch((error) => console.log(error));
                break;
            case "update":
                dataAPI.patch(itemPath, {
                    description: updateMenu.description,
                    price: updateMenu.price,
                    "ingredients[]": updateMenu.ingredients,
                    "units{}": updateMenu.units
                }).then(() => {
                    setUpdateItem(false);
                    getMenu();
                }).catch((error) => console.log(error));
                break;
            default:
                console.log("Unrecognised method");
        }
    });
    return (<Container className={`menu ${useContext(ThemeContext)}`}>
            <Row className='title'>
                <h2>Menu</h2>
            </Row>

            {(props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) &&
            <Row xs={2} className='actions'>
                    <Button className="add" onClick={() => {
                    setNewMenu(Object.assign({}, menuObj));
                    setAddItem(!addItem);
                }}>Add Item +</Button>
                </Row>}

            <MenuCreateForm theme={theme} addItem={addItem} onHide={() => setAddItem(false)} handleSubmit={handleSubmit} newMenu={newMenu} setNewMenu={setNewMenu} handleData={handleData} ingredients={ingredients}/>

            <Row xs={1} md={2} lg={3}>
                {menu.map((item, i) => {
            return (<Col key={`menu-item-${i}`}>
                            <Card.Body onClick={() => {
                    if (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) { // Only render update form if user isStaff and has a role of MANAGER | CHEF
                        setUpdateMenu(Object.assign(Object.assign({}, menuObj), item));
                        setUpdateItem(!updateItem);
                    }
                }} className={!props.isStaff ? "default-cursor" : ""}>
                                <Card.Title>{item.title}</Card.Title>
                                <CoffeeCup className="icon"/>
                                <div className='card-details'>
                                    <Card.Text>{item.description}</Card.Text>
                                    <Card.Text>{`£ ${item.price}`}</Card.Text>
                                    <Card.Text>Ingredients: {item.ingredients.map(item => ingredients[item]["title"]).join(", ")}</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>);
        })}
            </Row>

            <MenuUpdateForm onHide={() => setUpdateItem(false)} handleSubmit={handleSubmit} updateItem={updateItem} handleData={handleData} theme={theme} ingredients={ingredients} updateMenu={updateMenu} setUpdateMenu={setUpdateMenu}/>
        </Container>);
}
;
export default Menu;
