import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import type { Statistics, StatisticsObj, DateRange } from '../types/dashboardTypes';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer} from 'recharts';
import endpoints from "../data/endpoints";
import { ThemeContext } from './contexts';


function Dashboard (props: any) {


    // Set states
    const [statistics, setStatistics] = useState<Statistics>({
        low_stock: [],
        out_of_stock: [],
        sales: {},
        revenue: [],
        profit: []
    });

    // Set variables
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 14);

    const [dateRange, setDateRange] = useState<DateRange>({
        start_date: lastWeek.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        frequency: "W"
    });


    // Get statistics
    const getStats = (data: DateRange | undefined = undefined) => {
        console.log(dateRange);
        axios.patchForm(`${endpoints.prefix}${endpoints["dashboard"]}`,
            {...data}
        ).then((response) => {
            setStatistics({...response.data});
        }).catch((error) => {
            console.log(error);
        });
    };
 

    // Get statistics from api
    useEffect(() => {
        getStats(dateRange);
    }, [dateRange]);

    
    // Handle date input
    const handleDate = ({ target }: any) => {
        setDateRange({
            ...dateRange,
            [target.name]: target.value
        });
    };

    // Create cards
    const createAccordion = (status: string, title: string, statistic: Array<string> | StatisticsObj, comment: string) => {
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
                                                return <div key={ i }>{ item }</div>
                                            })
                                        ) : comment) : 
                                    (Object.keys(statistic).length != 0 ? 
                                        (Object.keys(statistic).map((key, i) => {
                                                return <div key={ i }>{ key }: { statistic[key] }</div>
                                            })
                                        ) : "No sales made :(")                                   
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        )
    };


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
                                <Tooltip labelStyle={{color: "#7A7A7A"}} itemStyle={{color: "rgba(57, 92, 107, 1)"}} />
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
        <Container className={ `dashboard ${ useContext(ThemeContext) }` }>

            <Row className='title'>
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
                { createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!") }
                { createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock") }
                { createAccordion("success", "Sales", statistics.sales, "No sales made :(")}
            </Row>

        </Container>
    )

};

export default Dashboard;