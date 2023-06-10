import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        return (_jsx(Accordion, Object.assign({ className: "stats" }, { children: _jsxs(Accordion.Item, Object.assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, Object.assign({ className: status }, { children: _jsxs("div", { children: [_jsx("b", { children: title }), _jsx("br", {}), statistic.length] }) })), _jsx(Accordion.Body, { children: Array.isArray(statistic) ?
                            (statistic.length !== 0 ?
                                (statistic.map((item, i) => {
                                    return _jsx("div", { children: item }, i);
                                })) : comment) :
                            (Object.keys(statistic).length != 0 ?
                                (Object.keys(statistic).map((key, i) => {
                                    return _jsxs("div", { children: [key, ": ", statistic[key]] }, i);
                                })) : "No sales made :(") })] })) })));
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
        return (_jsx(Col, { children: _jsx(Card, Object.assign({ className: "stats" }, { children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { children: title }), _jsx(ResponsiveContainer, Object.assign({ width: "90%", height: "75%" }, { children: _jsxs(BarChart, Object.assign({ data: data.length === 0 ? dummyData : data }, { children: [_jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: dataKey })] })) })), _jsx(Card.Text, { children: total >= 0 ? `Total: £ ${total.toFixed(2)}` : `Total: -£ ${Math.abs(total).toFixed(2)}` })] }) })) }));
    };
    return (_jsxs(Container, Object.assign({ className: `dashboard ${useContext(ThemeContext)}` }, { children: [_jsx(Row, Object.assign({ className: 'title' }, { children: _jsx("h2", { children: "Dashboard" }) })), _jsx(Row, { children: _jsxs(Col, Object.assign({ className: `date-range` }, { children: [_jsx("input", { type: "date", id: "start-date", name: "start_date", value: dateRange.start_date, onChange: e => handleDate(e) }), _jsx("input", { type: "date", id: "end-date", name: "end_date", value: dateRange.end_date, onChange: e => handleDate(e) }), _jsxs(Form.Select, Object.assign({ name: 'frequency', onChange: e => handleDate(e) }, { children: [_jsx("option", Object.assign({ value: "W" }, { children: "Weekly" })), _jsx("option", Object.assign({ value: "M" }, { children: "Monthly" })), _jsx("option", Object.assign({ value: "Q" }, { children: "Quarterly" }))] }))] })) }), _jsxs(Row, Object.assign({ lg: 2, xs: 1 }, { children: [createGraph("Revenue", statistics.revenue, "revenue"), createGraph("Profit", statistics.profit, "profit")] })), _jsxs(Row, Object.assign({ sm: 3, xs: 1 }, { children: [createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!"), createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock"), createAccordion("success", "Sales", statistics.sales, "No sales made :(")] }))] })));
}
;
export default Dashboard;
