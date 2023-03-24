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
export function Dashboard(props) {
    var _a;
    // Set states
    var _b = useState({
        low_stock: [],
        out_of_stock: [],
        sales: {}
    }), statistics = _b[0], setStatistics = _b[1];
    // Define variables
    var endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";
    // Get statistics
    function getStats() {
        axios.get(endpoint)
            .then(function (response) {
            setStatistics(__assign({}, response.data));
        }).catch(function (error) {
            console.log(error);
        });
    }
    // Get statistics from api
    useEffect(function () {
        getStats();
    }, []);
    // Generate graph
    var revenueData = [
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
    ];
    var revenueGraph = (_jsx(ResponsiveContainer, __assign({ width: "90%", height: "90%" }, { children: _jsxs(BarChart, __assign({ data: revenueData }, { children: [_jsx(XAxis, { dataKey: "name", stroke: props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1" }), _jsx(YAxis, { stroke: props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1" }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "revenue", fill: props.theme === "light-mode" ? "#395C6B" : "#F7EDE2" })] })) })));
    var profitData = [
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
    ];
    var profitGraph = (_jsx(ResponsiveContainer, __assign({ width: "90%", height: "90%" }, { children: _jsxs(BarChart, __assign({ data: profitData }, { children: [_jsx(XAxis, { dataKey: "name", stroke: props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1" }), _jsx(YAxis, { stroke: props.theme === "light-mode" ? "#7A7A7A" : "#E1E1E1" }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "profit", fill: props.theme === "light-mode" ? "#395C6B" : "#F7EDE2" })] })) })));
    var formatProfit = function () {
        var _a;
        return Number(statistics.profit) > 0 ? "\u00A3 ".concat((_a = statistics.profit) === null || _a === void 0 ? void 0 : _a.toFixed(2)) : "-\u00A3 ".concat(Math.abs(Number(statistics.profit)).toFixed(2));
    };
    var handleDate = function (_a) {
        var target = _a.target;
        console.log(target.value);
    };
    return (_jsxs(Container, __assign({ className: "dashboard ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Dashboard" }) })), _jsxs(Row, __assign({ lg: 2 }, { children: [_jsx(Col, __assign({ className: 'date-range', id: "start-date-range" }, { children: _jsx("input", { type: "date", id: "start-date", name: "start-date", onChange: function (e) { return handleDate(e); } }) })), _jsx(Col, __assign({ className: 'date-range', id: "end-date-range" }, { children: _jsx("input", { type: "date", id: "end-date", name: "end-date", onChange: function (e) { return handleDate(e); } }) }))] })), _jsxs(Row, __assign({ sm: 3, xs: 1, className: 'justify-content-center' }, { children: [_jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, __assign({ className: "error" }, { children: _jsxs("div", { children: [_jsx("b", { children: "Out of Stock" }), _jsx("br", {}), statistics.out_of_stock.length] }) })), _jsx(Accordion.Body, { children: statistics.out_of_stock.length != 0 ? (statistics.out_of_stock.map(function (item, i) {
                                            return _jsx("div", { children: item }, "out_if_stock_".concat(i));
                                        })) : "All items in stock!" })] })) })) }), _jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, __assign({ className: 'warning' }, { children: _jsxs("div", { children: [_jsx("b", { children: "Low Stock" }), _jsx("br", {}), statistics.low_stock.length] }) })), _jsx(Accordion.Body, { children: statistics.low_stock.length != 0 ? (statistics.low_stock.map(function (item, i) {
                                            return _jsx("div", { children: item }, "low_stock_".concat(i));
                                        })) : "No items low in stock" })] })) })) }), _jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, __assign({ className: "success" }, { children: _jsxs("div", { children: [_jsx("b", { children: "Sales" }), _jsx("br", {})] }) })), _jsx(Accordion.Body, { children: Object.keys(statistics.sales).length != 0 ? (Object.keys(statistics.sales).map(function (key, i) {
                                            return _jsxs("div", { children: [key, ": ", statistics.sales[key]] }, "sales_".concat(i));
                                        })) : "No sales made :(" })] })) })) })] })), _jsxs(Row, __assign({ lg: 2, sm: 1, xs: 1, className: 'justify-content-center' }, { children: [_jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: "Revenue" }), _jsxs(Card.Body, { children: [revenueGraph, "Weekly Total: \u00A3 ", (_a = statistics.revenue) === null || _a === void 0 ? void 0 : _a.toFixed(2)] })] })) }), _jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: "Profit" }), _jsxs(Card.Body, { children: [profitGraph, "Weekly Total: ", formatProfit()] })] })) })] }))] })));
}
;
