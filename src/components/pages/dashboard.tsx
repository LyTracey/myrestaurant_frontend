import '../../styles/dashboard.scss';
import { externalEndpoints } from "../../data/endpoints";
import { GlobalContext } from '../App';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer} from 'recharts';
import { useState, useEffect, useContext, ChangeEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import { dataAPI } from '../App';
import { AxiosResponse } from 'axios';

interface StatisticsObj {
    [key: string]: number
}

interface Statistics {
    low_stock: Array<string>,
    out_of_stock: Array<string>,
    sales: StatisticsObj,
    revenue: Array<StatisticsObj>,
    profit: Array<StatisticsObj>
}

interface DateRange {
    start_date: string | undefined,
    end_date: string | undefined
    frequency: string | undefined
}


function Dashboard () {

    // Set states
    const [statistics, setStatistics] = useState<Statistics>({
        low_stock: [],
        out_of_stock: [],
        sales: {},
        revenue: [],
        profit: []
    });
    const { theme: [theme] } = useContext(GlobalContext);

    // Set default date range
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 14);

    const [dateRange, setDateRange] = useState<DateRange>({
        start_date: lastWeek.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        frequency: "B"
    });
 

    // Get statistics from API
    useEffect(() => {
        dataAPI.patch(
            `${externalEndpoints["dashboard"]}`,
            dateRange
        ).then((response: AxiosResponse) => setStatistics({...response.data}));
    }, [dateRange]);

    
    // Handle date input
    const handleDate = ({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDateRange({
            ...dateRange,
            [target.name]: target.value
        });
    };

    // Create cards
    const createAccordion = (status: string, title: string, statistic: Array<string> | StatisticsObj, comment: string) => {
        return (
            <Accordion className="stats">
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
                                (statistic.length !== 0 ? 
                                    (statistic.map((item: string, i: number) => {
                                            return <div key={ i }>{ item }</div>
                                        })
                                    ) : comment) : 
                                (Object.keys(statistic).length !== 0 ? 
                                    (Object.keys(statistic).map((key, i) => {
                                            return <div key={ i }>{ key }: { statistic[key] }</div>
                                        })
                                    ) : "No sales made :(")                                   
                        }
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    };

    const createGraph = (title: string, data: Array<StatisticsObj>, dataKey: string) => {
        
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
                                <XAxis dataKey="date"/>
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey={ dataKey } />
                            </BarChart>
                        </ResponsiveContainer>
                        <Card.Text>{ total >= 0 ? `Total: £ ${ total.toFixed(2) }` :  `Total: -£ ${ Math.abs(total).toFixed(2) }` }</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        )
    };

    return (
        <Container className={ `page dashboard ${ theme }` }>

            <Row className='title'>
                <h2>Dashboard</h2>
            </Row>

            <Row>
                <Col className={`date-range`}>
                    <input type="date" id="start-date" name="start_date" value={ dateRange.start_date } onChange={e => handleDate(e)}/>
                    <input type="date" id="end-date" name="end_date" value={ dateRange.end_date } onChange={e => handleDate(e)}/>
                    <Form.Select name='frequency' onChange={e => handleDate(e)}>
                        <option value="B">Daily</option>
                        <option value="W-MON">Weekly</option>
                        <option value="MS">Monthly</option>
                        <option value="QS">Quarterly</option>
                    </Form.Select>
                </Col>
            </Row>


            <Row lg={2} xs={1}>
                { createGraph("Revenue", statistics.revenue, "revenue") }
                { createGraph("Profit", statistics.profit, "profit") }
            </Row>

            <Row sm={3} xs={1}>
                { createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!") }
                { createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock") }
                { createAccordion("success", "Sales", statistics.sales, "No sales made :(")}
            </Row>

        </Container>
    )

};

export default Dashboard;