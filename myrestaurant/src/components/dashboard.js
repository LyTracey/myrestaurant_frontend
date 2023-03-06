import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import '../style/dashboard.scss';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from "../images/placeholder-image.webp";
import Accordion from 'react-bootstrap/Accordion';
export function Dashboard() {
    // Set states
    var _a = useState({
        low_stock: [],
        out_of_stock: [],
        sales: {}
    }), statistics = _a[0], setStatistics = _a[1];
    // Define variables
    var endpoint = "http://127.0.0.1:8000/myrestaurant/dashboard/";
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
    return (_jsxs(Container, { children: [_jsxs(Row, __assign({ lg: 2, className: 'justify-content-center' }, { children: [_jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: "Revenue" }), _jsx(Card.Img, { variant: "top", src: placeholder }), _jsxs(Card.Body, { children: ["Weekly Total: \u00A3 ", statistics.revenue] })] })) }), _jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: "Profit" }), _jsx(Card.Img, { variant: "top", src: placeholder }), Number(statistics.revenue) > 0 ? (_jsxs(Card.Body, { children: ["Weekly Total: \u00A3 ", statistics.profit] })) : _jsxs(Card.Body, { children: ["Weekly Total: - \u00A3 ", Math.abs(Number(statistics.profit))] })] })) })] })), _jsxs(Row, __assign({ lg: 3, className: 'justify-content-center' }, { children: [_jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsxs(Accordion.Header, __assign({ className: 'warning' }, { children: ["Low Stock: ", statistics.low_stock.length] })), _jsx(Accordion.Body, { children: statistics.low_stock.length != 0 ? (statistics.low_stock.map(function (item, i) {
                                            return _jsx("div", { children: item }, "low_stock_".concat(i));
                                        })) : "No items low in stock" })] })) })) }), _jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsxs(Accordion.Header, __assign({ className: "error" }, { children: ["Out of Stock: ", statistics.out_of_stock.length] })), _jsx(Accordion.Body, { children: statistics.out_of_stock.length != 0 ? (statistics.out_of_stock.map(function (item, i) {
                                            return _jsx("div", { children: item }, "out_if_stock_".concat(i));
                                        })) : "All items in stock!" })] })) })) }), _jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, __assign({ className: "success" }, { children: "Sales" })), _jsx(Accordion.Body, { children: Object.keys(statistics.sales).length != 0 ? (Object.keys(statistics.sales).map(function (key, i) {
                                            return _jsxs("div", { children: [key, ": ", statistics.sales[key]] }, "sales_".concat(i));
                                        })) : "No sales made :(" })] })) })) })] }))] }));
}
;
