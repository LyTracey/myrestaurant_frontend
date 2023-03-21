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
export function Dashboard(props) {
    var _a, _b;
    // Set states
    var _c = useState({
        low_stock: [],
        out_of_stock: [],
        sales: {}
    }), statistics = _c[0], setStatistics = _c[1];
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
    return (_jsxs(Container, __assign({ className: "dashboard ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Dashboard" }) })), _jsxs(Row, __assign({ lg: 2, sm: 1, xs: 1, className: 'justify-content-center' }, { children: [_jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: "Revenue" }), _jsx(Card.Img, { variant: "top", src: placeholder }), _jsxs(Card.Body, { children: ["Weekly Total: \u00A3 ", (_a = statistics.revenue) === null || _a === void 0 ? void 0 : _a.toFixed(2)] })] })) }), _jsx(Col, { children: _jsxs(Card, __assign({ className: "stats" }, { children: [_jsx(Card.Title, { children: "Profit" }), _jsx(Card.Img, { variant: "top", src: placeholder }), Number(statistics.profit) > 0 ? (_jsxs(Card.Body, { children: ["Weekly Total: \u00A3 ", (_b = statistics.profit) === null || _b === void 0 ? void 0 : _b.toFixed(2)] })) : _jsxs(Card.Body, { children: ["Weekly Total: - \u00A3 ", Math.abs(Number(statistics.profit)).toFixed(2)] })] })) })] })), _jsxs(Row, __assign({ sm: 3, xs: 1, className: 'justify-content-center' }, { children: [_jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsxs(Accordion.Header, __assign({ className: "error" }, { children: ["Out of Stock: ", statistics.out_of_stock.length] })), _jsx(Accordion.Body, { children: statistics.out_of_stock.length != 0 ? (statistics.out_of_stock.map(function (item, i) {
                                            return _jsx("div", { children: item }, "out_if_stock_".concat(i));
                                        })) : "All items in stock!" })] })) })) }), _jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsxs(Accordion.Header, __assign({ className: 'warning' }, { children: ["Low Stock: ", statistics.low_stock.length] })), _jsx(Accordion.Body, { children: statistics.low_stock.length != 0 ? (statistics.low_stock.map(function (item, i) {
                                            return _jsx("div", { children: item }, "low_stock_".concat(i));
                                        })) : "No items low in stock" })] })) })) }), _jsx(Col, { children: _jsx(Accordion, __assign({ className: "stats col-auto" }, { children: _jsxs(Accordion.Item, __assign({ eventKey: "0" }, { children: [_jsx(Accordion.Header, __assign({ className: "success" }, { children: "Sales" })), _jsx(Accordion.Body, { children: Object.keys(statistics.sales).length != 0 ? (Object.keys(statistics.sales).map(function (key, i) {
                                            return _jsxs("div", { children: [key, ": ", statistics.sales[key]] }, "sales_".concat(i));
                                        })) : "No sales made :(" })] })) })) })] }))] })));
}
;
