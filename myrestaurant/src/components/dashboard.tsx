import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import type { Statistics, DateRange } from '../types/dashboardTypes';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer} from 'recharts';

export function Dashboard (props: any) {

    // Set states
    const [statistics, setStatistics] = useState<Statistics>({
        low_stock: [],
        out_of_stock: [],
        sales: {}
    });

    const [dateRange, setDateRange] = useState<DateRange>({
        start_date: new Date(),
        end_date: new Date()
    });

    // Define variables
    const endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";

    // Get statistics
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


    // Generate graph
    const revenueData = [
        {
            name: "Week 1",
            revenue: statistics.revenue
        },
        {
            name: "Week 2",
            revenue: 0
        },
        {
            name: "Week 3",
            revenue: 0
        },
        {
            name: "Week 4",
            revenue: 0
        }
    ]

    const revenueGraph = (
        <ResponsiveContainer width="90%" height="90%">
            <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke={ props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1"} />
                <YAxis stroke={ props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1"} />
                <Tooltip />
                <Bar dataKey="revenue" fill={ props.theme === "light-mode" ? "#395C6B" : "#F7EDE2"} />
            </BarChart>
        </ResponsiveContainer>
    );

    const profitData = [
        {
            name: "Week 1",
            profit: statistics.profit
        },
        {
            name: "Week 2",
            profit: 0
        },
        {
            name: "Week 3",
            profit: 0
        },
        {
            name: "Week 4",
            profit: 0
        }
    ]

    const profitGraph = (
        <ResponsiveContainer width="90%" height="90%">
            <BarChart data={profitData}>
                <XAxis dataKey="name" stroke={ props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1"} />
                <YAxis stroke={ props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1"} />
                <Tooltip />
                <Bar dataKey="profit" fill={ props.theme === "light-mode" ? "#395C6B" : "#F7EDE2"} />
            </BarChart>
        </ResponsiveContainer>
    );


    const formatProfit = () => {
        return Number(statistics.profit) > 0 ? `£ ${statistics.profit?.toFixed(2)}` : `-£ ${Math.abs(Number(statistics.profit)).toFixed(2)}`
    };

    const handleDate = ({ target }: any) => {
        console.log(target.value);
    };


    return (
        <Container className={ `dashboard ${ props.theme }` }>
            <Row className='title justify-content-center'>
                    <h2>Dashboard</h2>
            </Row>
            <Row lg={2}>
                <Col className='date-range' id="start-date-range">
                    <input type="date" id="start-date" name="start-date" onChange={e => handleDate(e)}/>
                </Col>
                <Col className='date-range' id="end-date-range">
                    <input type="date" id="end-date" name="end-date" onChange={e => handleDate(e)}/>
                </Col>
            </Row>

            <Row sm={3} xs={1} className='justify-content-center'>
                <Col>
                    <Accordion className="stats col-auto">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header className="error">
                                <div>
                                    <b>Out of Stock</b><br/>
                                    { statistics.out_of_stock.length }                    
                                </div>
                            </Accordion.Header>
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
                            <Accordion.Header className='warning'>
                                <div>
                                    <b>Low Stock</b><br/>
                                    { statistics.low_stock.length }
                                </div>
                            </Accordion.Header>
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
                            <Accordion.Header className="success">
                                <div>
                                    <b>Sales</b><br/>
                                </div>
                            </Accordion.Header>
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

            <Row lg={2} sm={1} xs={1} className='justify-content-center'>
                <Col >
                    <Card className="stats">
                        <Card.Title>Revenue</Card.Title>
                        <Card.Body>
                            { revenueGraph }
                            Weekly Total: £ { statistics.revenue?.toFixed(2) }
                        </Card.Body>
                    </Card>
                </Col>

                <Col >
                    <Card className="stats">
                        <Card.Title>Profit</Card.Title>
                        <Card.Body>
                            { profitGraph }
                            Weekly Total: { formatProfit() }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </Container>
    )

};