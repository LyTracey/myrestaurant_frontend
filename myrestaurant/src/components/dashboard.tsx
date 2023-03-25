import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import type { Statistics, Sales, DateRange } from '../types/dashboardTypes';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer} from 'recharts';
import { profitData, revenueData } from '../data/dashboard_data';


export function Dashboard (props: any) {


    // Set states
    const [statistics, setStatistics] = useState<Statistics>({
        low_stock: [],
        out_of_stock: [],
        sales: {},
        revenue: 0,
        profit: 0
    });

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [dateRange, setDateRange] = useState<DateRange>({
        start_date: lastWeek.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0]
    });


    // Define variables
    const endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';


    // Get statistics
    const getStats = (method: string, data: DateRange | undefined = undefined) => {
        axios({
            method: method,
            url: endpoint,
            data: data
        })
        .then((response) => {
            setStatistics({...response.data});
        }).catch((error) => {
            console.log(error);
        });
    };
 

    // Get statistics from api
    useEffect(() => {
        getStats("patch", dateRange);
    }, []);


    // Handle date input
    const handleDate = ({ target }: any) => {
        setDateRange({
            ...dateRange,
            [target.name]: target.value
        });
        getStats("patch", dateRange);
    };

    // Create cards
    const createAccordion = (status: string, title: string, statistic: Array<string> | Sales, comment: string, keyPrefix: string) => {
        return (
            <Col>
                <Accordion className="stats col-auto">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className={ status }>
                            <div>
                                <b>{ title }</b><br/>
                                { statistic.length }                    
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            {   
                                Array.isArray(statistic) ? 
                                    (statistic.length != 0 ? 
                                        (statistic.map((item: string, i: number) => {
                                                return <div key={`${ keyPrefix }-${i}`}>{ item }</div>
                                            })
                                        ) : comment) : 
                                    (Object.keys(statistic).length != 0 ? 
                                        (Object.keys(statistic).map((key, i) => {
                                                return <div key={`${ keyPrefix }-${ i }`}>{ key }: { statistic[key] }</div>
                                            })
                                        ) : "No sales made :(")                                   
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        )
    };

    // Generate data for graphs

    // Create bar graph crads
    const createGraph = (title: string, data: any, axisColour: string, barColour: string, statistic: number, dataKey: string) => {
        return (
            <Col >
                <Card className="stats">
                    <Card.Title>{ title }</Card.Title>
                    <Card.Body>
                    <ResponsiveContainer width="90%" height="90%">
                        <BarChart data={ data }>
                            <XAxis dataKey="name" stroke={ axisColour } />
                            <YAxis stroke={ axisColour } />
                            <Tooltip />
                            <Bar dataKey={ dataKey } fill={ barColour } />
                        </BarChart>
                    </ResponsiveContainer>
                    Weekly Total: { Number(statistic) >= 0 ? `£ ${statistic.toFixed(2)}` : `-£ ${Math.abs(Number(statistic)).toFixed(2)}` }
                    </Card.Body>
                </Card>
            </Col>
        )
    };


    return (
        <Container className={ `dashboard ${ props.theme }` }>


            <Row className='title justify-content-center'>
                    <h2>Dashboard</h2>
            </Row>


            <Row lg={2}>
                <Col className={`date-range`} id="start-date-range">
                    <input type="date" id="start-date" name="start_date" onChange={e => handleDate(e)}/>
                </Col>
                <Col className='date-range' id="end-date-range">
                    <input type="date" id="end-date" name="end_date" onChange={e => handleDate(e)}/>
                </Col>
            </Row>


            <Row sm={3} xs={1} className='justify-content-center'>
                { createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!", "out-of-stock") }
                { createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock", "low-stock") }
                { createAccordion("success", "Sales", statistics.sales, "No sales made :(", "sales")}
            </Row>


            <Row lg={2} sm={1} xs={1} className='justify-content-center'>
                { createGraph("Revenue", revenueData, props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1", props.theme === "light-mode" ? "#395C6B" : "#F7EDE2", statistics.revenue, "revenue") }
                { createGraph("Profit", profitData, props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1", props.theme === "light-mode" ? "#395C6B" : "#F7EDE2", statistics.profit, "profit") }
            </Row>


        </Container>
    )

};