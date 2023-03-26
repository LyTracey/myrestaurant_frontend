import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import type { Statistics, StatisticsObj, DateRange } from '../types/dashboardTypes';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer} from 'recharts';


export function Dashboard (props: any) {


    // Set states
    const [statistics, setStatistics] = useState<Statistics>({
        low_stock: [],
        out_of_stock: [],
        sales: {},
        revenue: [],
        profit: []
    });

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 14);

    const [dateRange, setDateRange] = useState<DateRange>({
        start_date: lastWeek.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        frequency: "W"
    });


    // Define variables
    const endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';


    // Get statistics
    const getStats = async (method: string, data: DateRange | undefined = undefined) => {
        await axios({
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
    }, [dateRange]);

    
    // Handle date input
    const handleDate = ({ target }: any) => {
        setDateRange({
            ...dateRange,
            [target.name]: target.value
        });
    };

    // Create cards
    const createAccordion = (status: string, title: string, statistic: Array<string> | StatisticsObj, comment: string, keyPrefix: string) => {
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


    // Create bar graph crads
    const createGraph = (title: string, data: Array<StatisticsObj>, axisColour: string, barColour: string, dataKey: string) => {
        
        const total = data.map(item => Number(item[dataKey]) ).reduce((a: number, x: number) => a + x, 0);

        const dummyData = [
            {
                date: dateRange.start_date,
                [dataKey]: 0
            },
            {
                date: dateRange.end_date,
                [dataKey]: 0
            }
        ];


        return (
            <Col >
                <Card className="stats">
                    <Card.Body>
                        <Card.Title>{ title }</Card.Title>
                        <ResponsiveContainer width="90%" height="75%">
                            <BarChart data={ data.length === 0 ? dummyData : data}>
                                <XAxis dataKey="date" stroke={ axisColour } />
                                <YAxis stroke={ axisColour } />
                                <Tooltip />
                                <Bar dataKey={ dataKey } fill={ barColour } />
                            </BarChart>
                        </ResponsiveContainer>
                        <Card.Text>{ total >= 0 ? `Total: £ ${ total.toFixed(2) }` :  `Total: -£ ${ Math.abs(total).toFixed(2) }` }</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        )
    };

    const axisColour = props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1";
    const barColour = props.theme === "light-mode" ? "#395C6B" : "#F7EDE2";

    return (
        <Container className={ `dashboard ${ props.theme }` }>

            <Row className='title justify-content-center'>
                    <h2>Dashboard</h2>
            </Row>


            <Row>
                <Col className={`date-range`}>
                    <input type="date" id="start-date" name="start_date" onChange={e => handleDate(e)}/>
                    <input type="date" id="end-date" name="end_date" onChange={e => handleDate(e)}/>
                    <Form.Select name='frequency' onChange={e => handleDate(e)}>
                        <option value="W">Weekly</option>
                        <option value="M">Monthly</option>
                        <option value="Q">Quarterly</option>
                    </Form.Select>
                </Col>
            </Row>


            <Row lg={2} sm={1} xs={1} className='justify-content-center'>
                { createGraph("Revenue", statistics.revenue, axisColour, barColour, "revenue") }
                { createGraph("Profit", statistics.profit, axisColour, barColour, "profit") }
            </Row>

            <Row sm={3} xs={1} className='justify-content-center'>
                { createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!", "out-of-stock") }
                { createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock", "low-stock") }
                { createAccordion("success", "Sales", statistics.sales, "No sales made :(", "sales")}
            </Row>

        </Container>
    )

};