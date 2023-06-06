import { __awaiter } from "tslib";
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import slugify from 'slugify';
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
function ArchivedOrders() {
    // Set states
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState({});
    // Fetch menu data from backend
    const getOrders = () => {
        dataAPI.get(`${endpoints["archivedOrders"]}`).then((response) => {
            setOrders(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    const getMenu = () => {
        dataAPI.get(`${endpoints["menu"]}`).then((response) => {
            const filteredMenu = {};
            // Return object of id as key and ingredient as value fields for each inventory item 
            response.data.forEach((item) => {
                if (item.available_quantity > 0) {
                    filteredMenu[item.id] = { title: item.title, available_quantity: item.available_quantity };
                }
            });
            setMenu(filteredMenu);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch menu data and ingredients data on first load
    useEffect(() => {
        getOrders();
        getMenu();
    }, []);
    // Handle submit multipart form to backend
    const handleSubmit = (e, id) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const itemPath = `${endpoints["orders"]}${slugify(String(id))}/`;
        dataAPI.patch(itemPath, {
            complete: false
        }).then(() => {
            getOrders();
        }).catch((error) => {
            console.log(error);
        });
    });
    return (<Container className={`orders ${useContext(ThemeContext)}`}>
            <Row className='title'>
                <h2>Archived Orders</h2>
            </Row>
            
            <Row className='actions'>
                <Button className="live-orders" as="a" href='/orders'>Live Orders</Button>
            </Row>

            <Table responsive>
                <thead>
                    <tr className='headers'>
                        <th>Order ID</th>
                        <th>Menu Items</th>
                        <th>Notes</th>
                        <th>Ordered At</th>
                        <th>Prepared At</th>
                        <th>Delivered At</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {orders.map((item, i) => {
            return (<tr className='rows' key={i}>
                                    <td className='id'>{item.id}</td>
                                    <td className='menu-items'>{item.menu_items.map((item, i) => {
                    var _a;
                    return (<p key={i}>{(_a = menu[item]) === null || _a === void 0 ? void 0 : _a["title"]}</p>);
                })}</td>
                                    <td className='notes'>{item.notes}</td>
                                    <td className='ordered-at'>{String(item.ordered_at)}</td>
                                    <td className='prepared-at'>{String(item.prepared_at)}</td>
                                    <td className='delivered-at'>{String(item.delivered_at)}</td>
                                    <td className='edit-order'><Button className="edit" onClick={(e) => handleSubmit(e, item.id)}>Edit</Button></td>
                                </tr>);
        })}
                </tbody>
            </Table>

        </Container>);
}
;
export default ArchivedOrders;
