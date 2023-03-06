import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from "../images/placeholder-image.webp";
import Accordion from 'react-bootstrap/Accordion';
import type { Statistics } from '../types/dashboardTypes';


export function Dashboard () {

    // Set states
    const [statistics, setStatistics] = useState<Statistics>({
        low_stock: [],
        out_of_stock: [],
        sales: {}
    });

    // Define variables
    const endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";


    function getStats() {
        axios.get(endpoint)
        .then((response) => {
            setStatistics({...response.data});
        }).catch((error) => {
            console.log(error);
        });
    }

    // Get statistics from api
    useEffect(() => {
        getStats();
    }, []);

    return (
        <Container>
            <Row lg={2} className='justify-content-center'>
                <Col >
                    <Card className="stats">
                        <Card.Title>Revenue</Card.Title>
                        <Card.Img variant="top" src={ placeholder }></Card.Img>
                        <Card.Body>Weekly Total: £ { statistics.revenue }</Card.Body>
                    </Card>
                </Col>

                <Col >
                    <Card className="stats">
                        <Card.Title>Profit</Card.Title>
                        <Card.Img variant="top" src={ placeholder }></Card.Img>
                        { Number(statistics.revenue) > 0 ? (<Card.Body>Weekly Total: £ { statistics.profit }</Card.Body>) :  <Card.Body>Weekly Total: - £ { Math.abs(Number(statistics.profit)) }</Card.Body>}
                    </Card>
                </Col>
            </Row>

            <Row lg={3} className='justify-content-center'>
                <Col>
                    <Accordion className="stats col-auto">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header className='warning'>Low Stock: { statistics.low_stock.length }</Accordion.Header>
                            <Accordion.Body>
                                {   
                                    statistics.low_stock.length != 0 ? (
                                    statistics.low_stock.map((item, i) => {
                                        return <div key={`low_stock_${i}`}>{ item }</div>
                                    })) : "No items low in stock"

                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>

                <Col>
                    <Accordion className="stats col-auto">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header className="error">Out of Stock: { statistics.out_of_stock.length }</Accordion.Header>

                            <Accordion.Body>
                                {   
                                    statistics.out_of_stock.length != 0 ? (
                                        statistics.out_of_stock.map((item, i) => {
                                            return <div key={`out_if_stock_${i}`}>{ item }</div>
                                        })) : "All items in stock!"
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                
                <Col>
                    <Accordion className="stats col-auto">
                        <Accordion.Item eventKey="0">
                        <Accordion.Header className="success">Sales</Accordion.Header>
                            <Accordion.Body>
                                {   
                                    Object.keys(statistics.sales).length != 0 ? (
                                        Object.keys(statistics.sales).map((key, i) => {
                                            return <div key={`sales_${ i }`}>{ key }: { statistics.sales[key] }</div>
                                        })) : "No sales made :("
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>

        </Container>
    )
};