import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { profitData, revenueData } from '../data/dashboard_data';
export function Dashboard(props) {
    // Set states
    var _a = useState({
        low_stock: [],
        out_of_stock: [],
        sales: {},
        revenue: 0,
        profit: 0
    }), statistics = _a[0], setStatistics = _a[1];
    var today = new Date();
    var lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    var _b = useState({
        start_date: lastWeek.toISOString().split('T')[0],
        end_date: today.toISOString().split('T')[0]
    }), dateRange = _b[0], setDateRange = _b[1];
    // Define variables
    var endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    // Get statistics
    var getStats = function (method, data) {
        if (data === void 0) { data = undefined; }
        axios({
            method: method,
            url: endpoint,
            data: data
        })
            .then(function (response) {
            setStatistics(__assign({}, response.data));
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Get statistics from api
    useEffect(function () {
        getStats("patch", dateRange);
    }, []);
    useEffect(function () {
        console.log(dateRange);
    });
    // Handle date input
    var handleDate = function (_a) {
        var _b;
        var target = _a.target;
        setDateRange(__assign(__assign({}, dateRange), (_b = {}, _b[target.name] = target.value, _b)));
        getStats("patch", dateRange);
    };
    // Create cards
    var createAccordion = function (status, title, statistic, comment, keyPrefix) {
        return (_jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, __assign({ className: status }, { children: _jsxs("div", { children: [_jsx("b", { children: title }), _jsx("br", {}), statistic.length] }) })), _jsx(Accordion.Body, { children: Array.isArray(statistic) ?
                                (statistic.length != 0 ?
                                    (statistic.map(function (item, i) {
                                        return _jsx("div", { children: item }, "".concat(keyPrefix, "-").concat(i));
                                    })) : comment) :
                                (Object.keys(statistic).length != 0 ?
                                    (Object.keys(statistic).map(function (key, i) {
                                        return _jsxs("div", { children: [key, ": ", statistic[key]] }, "".concat(keyPrefix, "-").concat(i));
                                    })) : "No sales made :(") })] })) })) }));
    };
    // Generate data for graphs
    // Create bar graph crads
    var createGraph = function (title, data, axisColour, barColour, statistic, dataKey) {
        return (_jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: title }), _jsxs(Card.Body, { children: [_jsx(ResponsiveContainer, __assign({ width: "90%", height: "90%" }, { children: _jsxs(BarChart, __assign({ data: data }, { children: [_jsx(XAxis, { dataKey: "name", stroke: axisColour }), _jsx(YAxis, { stroke: axisColour }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: dataKey, fill: barColour })] })) })), "Weekly Total: ", Number(statistic) >= 0 ? "\u00A3 ".concat(statistic.toFixed(2)) : "-\u00A3 ".concat(Math.abs(Number(statistic)).toFixed(2))] })] })) }));
    };
    return (_jsxs(Container, __assign({ className: "dashboard ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Dashboard" }) })), _jsxs(Row, __assign({ lg: 2 }, { children: [_jsx(Col, __assign({ className: "date-range", id: "start-date-range" }, { children: _jsx("input", { type: "date", id: "start-date", name: "start_date", onChange: function (e) { return handleDate(e); } }) })), _jsx(Col, __assign({ className: 'date-range', id: "end-date-range" }, { children: _jsx("input", { type: "date", id: "end-date", name: "end_date", onChange: function (e) { return handleDate(e); } }) }))] })), _jsxs(Row, __assign({ sm: 3, xs: 1, className: 'justify-content-center' }, { children: [createAccordion("error", "Out of Stock", statistics.out_of_stock, "All items in stock!", "out-of-stock"), createAccordion("warning", "Low Stock", statistics.low_stock, "No items low in stock", "low-stock"), createAccordion("success", "Sales", statistics.sales, "No sales made :(", "sales")] })), _jsxs(Row, __assign({ lg: 2, sm: 1, xs: 1, className: 'justify-content-center' }, { children: [createGraph("Revenue", revenueData, props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1", props.theme === "light-mode" ? "#395C6B" : "#F7EDE2", statistics.revenue, "revenue"), createGraph("Profit", profitData, props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1", props.theme === "light-mode" ? "#395C6B" : "#F7EDE2", statistics.profit, "profit")] }))] })));
}
;
