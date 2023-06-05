import '../../styles/dashboard.scss';
import endpoints from "../../data/endpoints";
import { ThemeContext } from '../Base/App';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import { dataAPI } from '../Base/App';
function Dashboard() {
    // Set states
    const [statistics, setStatistics] = useState({
        low_stock: [],
        out_of_stock: [],
        sales: {},
        revenue: [],
        profit: []
    });
    // Set default date range
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 14);
    const [dateRange, setDateRange] = useState({
        start_date: lastWeek.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0],
        frequency: "W"
    });
    // API call to get statistics data
    const getStats = (data = undefined) => {
        dataAPI.patch(`${endpoints["dashboard"]}`, Object.assign({}, data)).then((response) => {
            setStatistics(Object.assign({}, response.data));
        }).catch((error) => {
            console.log(error);
        });
    };
    // Get statistics from API
    useEffect(() => {
        getStats(dateRange);
    }, [dateRange]);
    // Handle date input
    const handleDate = ({ target }) => {
        setDateRange(Object.assign(Object.assign({}, dateRange), { [target.name]: target.value }));
    };
    // Create cards
    const createAccordion = (status, title, statistic, comment) => {
        return (<Accordion className="stats">
                <Accordion.Item eventKey="0">
                    <Accordion.Header className={status}>
                        <div>
                            <b>{title}</b><br />
                            {statistic.length}                    
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        {Array.isArray(statistic) ?
                (statistic.length !== 0 ?
                    (statistic.map((item, i) => {
                        return <div key={i}>{item}</div>;
                    })) : comment) :
                (Object.keys(statistic).length != 0 ?
                    (Object.keys(statistic).map((key, i) => {
                        return <div key={i}>{key}: {statistic[key]}</div>;
                    })) : "No sales made :(")}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>);
    };
    const createGraph = (title, data, dataKey) => {
        const total = data.map(item => Number(item[dataKey])).reduce((a, x) => a + x, 0);
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
        return (<Col>
                <Card className="stats">
                    <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        <ResponsiveContainer width="90%" height="75%">
                            <BarChart data={data.length === 0 ? dummyData : data}>
                                <XAxis dataKey="date"/>
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey={dataKey}/>
                            </BarChart>
                        </ResponsiveContainer>
                        <Card.Text>{total >= 0 ? `Total: £ ${total.toFixed(2)}` : `Total: -£ ${Math.abs(total).toFixed(2)}`}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>);
    };
    return (<Container className={`dashboard ${useContext(ThemeContext)}`}>

            <Row className='title'>
                <h2>Dashboard</h2>
            </Row>


            <Row>
                <Col className={`date-range`}>
                    <input type="date" id="start-date" name="start_date" value={dateRange.start_date} onChange={e => handleDate(e)}/>
                    <input type="date" id="end-date" name="end_date" value={dateRange.end_date} onChange={e => handleDate(e)}/>
                    <Form.Select name='frequency' onChange={e => handleDate(e)}>
                        <option value="W">Weekly</option>
                        <option value="M">Monthly</option>
                        <option value="Q">Quarterly</option>
                    </Form.Select>
                </Col>
            </Row>


            <Row lg={2} xs={1}>
                {createGraph("Revenue", statistics.revenue, "revenue")}
                {createGraph("Profit", statistics.profit, "profit")}
            </Row>

            <Row sm={3} xs={1}>
                {createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!")}
                {createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock")}
                {createAccordion("success", "Sales", statistics.sales, "No sales made :(")}
            </Row>

        </Container>);
}
;
export default Dashboard;
