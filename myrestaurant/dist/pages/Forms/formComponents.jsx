import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import React from "react";
;
export function ReadFieldGroup({ value, name, label, type }, options = {}) {
    /*
        Returns a simple read-only form field with a label.
    */
    return (<Form.Group className={`field-group ${name}`} as={Row} sm={2}>
            <Form.Label column sm={3}>{label}</Form.Label>
            <Col className="field" sm={9}>
                <Form.Control name={name} value={value} type={type} disabled {...options}>                                
                </Form.Control>
            </Col>
        </Form.Group>);
}
;
;
export function EditFieldGroup({ value, name, label, type, dataHandler, method, feedback }, options = {}) {
    /*
        Returns a simple editable form field with a label.

        NOTE: if type is number, `value` is casted to number.
    */
    return (<Form.Group className={`field-group ${name}`} as={Row} sm={2}>
            <Form.Label column sm={3}>{label}</Form.Label>
            <Col className="field" sm={9}>
                <Form.Control name={name} defaultValue={value} type={type} onChange={e => dataHandler(name, (type === "number" ? Number(e.target.value) : e.target.value), method)} {...options}>                                
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {feedback}
                </Form.Control.Feedback>
            </Col>
        </Form.Group>);
}
;
export const multiDataHandler = ({ data, values_obj, items_list, item, value, checked, setObj }) => {
    /*
        Returns the `data` object with updated values in `values_obj` and `item_list`
            1. If `checked`, updates the `item` value in `object` with `value`.
            2. If `checked` and the `item` isn't in `item_list`, `item` is added to the list.
            3. If not `checked`, `item` is removed from `object` and `item_list`.
        
        NOTE: data is the whole state object that is being edited/viewed.
        NOTE: values_obj is the selected list of instances of the related model e.g. menu_items for an orders form.
    */
    let obj = Object.assign({}, data);
    obj[values_obj] = Object.assign({}, obj[values_obj]); // spread so nested object isn't passed by reference
    obj[items_list] = [...obj[items_list]]; // spread so nested array isn't passed by reference
    if (checked) {
        obj[values_obj][item] = value !== null && value !== void 0 ? value : "";
        if (!obj[items_list].includes(Number(item))) {
            obj[items_list] = [...obj[items_list], Number(item)];
        }
    }
    else {
        delete obj[values_obj][item];
        obj[items_list] = obj[items_list].filter((id) => id !== Number(item));
    }
    setObj(obj);
};
;
export function SelectMultiFieldGroup({ name, data, reference, values_obj, items_list, setObj }, options = {}) {
    /*
        Returns a multi-select checkbox list with labels for each item in `data_list`.
            1. When an item is checked, calls `multiDataHandler` to update relevate states.
            
        NOTE: data is the whole state object that is being edited/viewed.
        NOTE: reference is the full list of all instances of the related model e.g. menu_items for an orders form.
    */
    return (<>
            {Object.entries(reference).map((item, i) => {
            return (<Form.Check className={`multi-select-field ${name}`} key={`${name}_${i}`} type="checkbox" label={item[1].title} name={name} value={item[0]} checked={data[items_list].includes(Number(item[0]))} onChange={e => multiDataHandler({
                    data: data,
                    values_obj: values_obj,
                    items_list: items_list,
                    item: String(item[0]),
                    checked: e.target.checked,
                    setObj: setObj
                })} {...options}/>);
        })}                    
        </>);
}
;
export function InputMultiFieldGroup({ type, reference, data, values_obj, items_list, name, setObj, feedback }, options = {}) {
    /*
        Returns a multi-input fieldset for selected items.
        
        NOTE: if type is number, `value` is casted to number.
    */
    return (<>
            {Object.entries(reference).map((item, i) => {
            var _a;
            const new_options = Object.fromEntries(Object.entries(options).map((entry) => {
                if (typeof (entry[1]) === "object") {
                    return [entry[0], entry[1][item[0]]];
                }
                return entry;
            }));
            return ((_a = data[items_list]) !== null && _a !== void 0 ? _a : []).includes(Number(item[0])) ?
                (<Form.Group className={`multi-input-field ${name}`} key={`${name}_${i}`}>
                            <Form.Control type={type} name={name} defaultValue={data[values_obj][String(item[0])]} onChange={e => {
                        var _a;
                        return multiDataHandler({
                            data: data,
                            values_obj: values_obj,
                            items_list: items_list,
                            item: String(item[0]),
                            value: (_a = (type === "number" ? Number(e.target.value) : e.target.value)) !== null && _a !== void 0 ? _a : "",
                            checked: true,
                            setObj: setObj
                        });
                    }} {...new_options}></Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {feedback}
                            </Form.Control.Feedback>
                        </Form.Group>)
                : <div className="field" key={i}></div>;
        })}
        </>);
}
;
export function DeleteAlert(data, setDeleteAlert, handleSubmit) {
    /*
        Returns an alert that confirms the user wants to delete the item.
            1. If cancel, dismiss alert and return to modal.
            2. If yes, send a delete request to the backend API and close modal.
    */
    return (<Alert onClose={() => setDeleteAlert(false)} dismissible>
            <Alert.Heading>
                Are you sure you want to delete this item?
            </Alert.Heading>
            <div className='alert-actions'>
                <Button type="button" className="cancel" onClick={() => setDeleteAlert(false)}>Cancel</Button>
                <Button type="button" className="yes" onClick={(e) => {
            handleSubmit(e, "delete", data);
            setDeleteAlert(false);
        }}>Yes</Button>
            </div>
        </Alert>);
}
;
;
export function ColumnsToRows(columns, widths) {
    /*
        Accepts column-wise data and returns row-wise data by index.
        E.g. If `colA` and `colB` are inputs, the first row will be:
            <Row>
                <Col>colA[0]</Col>
                <Col>colB[0]</Col>
            </Row>

        `widths` parameter determines the column widths according to the bootstrap grid system.
        
        NOTE: Columns must have the same length.
        NOTE: Each column should have an outer wrapper but the wrapper is ignored in the final result.
    */
    const count = Array((columns[0].props.children.length)).fill("");
    return (<>
            {count.map((_, i) => {
            return (<Row key={`row_${i}`}>
                            {columns.map((col, index) => {
                    const colWidths = Object.fromEntries(Object.entries(widths).map(entry => [entry[0], entry[1][index]]));
                    return (<Col key={`col_${index}`} {...colWidths}>
                                        {col.props.children[i]}
                                    </Col>);
                })}
                        </Row>);
        })}
        </>);
}
;
export function Submit() {
    return (<Row className="form-actions">
            <Button type="submit" className="submit">SUBMIT</Button>
        </Row>);
}
;
export function SubmitDelete(setDeleteAlert) {
    return (<Row className="form-actions">
            <Button type="submit" className="submit">SUBMIT</Button>
            <Button type="button" className="delete" onClick={() => setDeleteAlert(true)}>DELETE</Button>
        </Row>);
}
;
