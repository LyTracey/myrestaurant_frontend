import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { MutableRefObject, SetStateAction, MouseEvent} from "react";

interface ReadFieldGroupInput {
    value: number | string,       // value of field
    name: string,                 // name of field
    label: string,                // display label of field
    type: string                  // type of input
};


export function ReadFieldGroup ({value, name, label, type}: ReadFieldGroupInput, options: object = {}) {
    /* 
        Returns a simple read-only form field with a label.
    */

    return (
        <Form.Group className={ `field-group ${ name }` } as={Row} sm={2}>
            <Form.Label column sm={3}>{ label }</Form.Label>
            <Col className="field" sm={9}>
                <Form.Control
                    name={ name }
                    value={ value }
                    type={ type }
                    disabled
                    {...options}
                >                                
                </Form.Control>
            </Col>
        </Form.Group>
    )
};


type DataHandler = (name: string, value: any, method: string) => void;


interface EditFieldGroupInput {
    value: number | string,     // value of field
    name: string,               // name if field 
    label: string,              // display label of field group
    type: string,               // type of input
    dataHandler: DataHandler,   // function to update state onChange
    method: "add" | "update",   // method of request
    // method: Dispatch<SetStateAction<any>>
    feedback?: string           // feedback provided when invalid data is submitted
};


export function EditFieldGroup ({value, name, label, type, dataHandler, method, feedback}: EditFieldGroupInput, options: object = {}) {
    /* 
        Returns a simple editable form field with a label.

        NOTE: if type is number, `value` is casted to number.
    */

    return (    
        <Form.Group className={ `field-group ${ name }` } as={Row} sm={2}>
            <Form.Label column sm={3}>{ label }</Form.Label>
            <Col className="field" sm={9}>
                <Form.Control
                    name={ name }
                    defaultValue={ value }
                    type={ type }
                    onChange={e => dataHandler(name, (type === "number" ? Number(e.target.value) : e.target.value), method)}
                    {...options}
                >                                
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    { feedback }
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    )
};


interface EditFieldGroup2Input {
    name: string,               // name of field 
    label: string,              // display label of field group
    type: string,               // type of input
    ref: MutableRefObject<any>,
    defaultValue: string,
    feedback?: string           // feedback provided when invalid data is submitted
};

export function EditFieldGroup2 ({name, label, type, ref, defaultValue, feedback}: EditFieldGroup2Input, options: object = {}) {
    /* 
        Returns a simple editable form field with a label.

        NOTE: if type is number, `value` is casted to number.
    */

    return (    
        <Form.Group className={ `field-group ${ name }` } as={Row} sm={2}>
            <Form.Label column sm={3}>{ label }</Form.Label>
            <Col className="field" sm={9}>
                <Form.Control
                    name={ name }
                    defaultValue={ defaultValue }
                    type={ type }
                    ref={ ref }
                    {...options}
                >                                
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    { feedback }
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
    )
};


interface multiDataHandlerInput {
    data: {[key: string]: any},             // object state being updated
    values_obj: string,                     // name of object in `data` containing key-value pairs of selected items e.g. { menu_item: quantity }
    items_list: string,                     // name of array in `data` containing ids of selected items e.g. menu_items
    item: string,                           // item in `values_obj` and `item_list` being updated
    value?: any                             // value to be assigned to item in `values_obj
    checked: boolean,                       // boolean of whether item is currently selected
    setObj: (obj: object) => void,          // method to set state of object being updated/added
}


export const multiDataHandler = ({data, values_obj, items_list, item, value, checked, setObj}: multiDataHandlerInput): void => {
    /*
        Returns the `data` object with updated values in `values_obj` and `item_list`
            1. If `checked`, updates the `item` value in `object` with `value`.
            2. If `checked` and the `item` isn't in `item_list`, `item` is added to the list.
            3. If not `checked`, `item` is removed from `object` and `item_list`.
        
        NOTE: data is the whole state object that is being edited/viewed.
        NOTE: values_obj is the selected list of instances of the related model e.g. menu_items for an orders form.
    */
   
    // let obj = {...data};
    // obj[values_obj] = {...obj[values_obj]};     // spread so nested object isn't passed by reference
    // obj[items_list] = [...obj[items_list]];     // spread so nested array isn't passed by reference

    let obj = structuredClone(data);

    if (checked) {
        obj[values_obj][item] = value ?? "";
        if (!obj[items_list].includes(Number(item))) {
            obj[items_list] = [...obj[items_list], Number(item)];
        }
    } else {
        delete obj[values_obj][item];
        obj[items_list] = obj[items_list].filter((id: number) => id !== Number(item));
    }
     
    setObj(obj);
};


interface SelectMultiFieldGroupObj {
    name: string,                               // name of fieldset
    label?: string,                             // displayed label of fieldset
    data: {[key: string]: any},                 // object state being updated
    reference: object,                          // object containing the full list of items to select from
    values_obj: string,                         // name of object in `data` containing key-value pairs of selected items e.g. { menu_item: quantity }
    items_list: string,                         // name of array in `data` containing ids of selected items e.g. menu_items
    setObj: (obj: object) => void               // method to set state of object being updated/added
};


export function SelectMultiFieldGroup ({name, data, reference, values_obj, items_list, setObj}: SelectMultiFieldGroupObj, options: object = {}) {
    /*
        Returns a multi-select checkbox list with labels for each item in `data_list`.
            1. When an item is checked, calls `multiDataHandler` to update relevate states.
            
        NOTE: data is the whole state object that is being edited/viewed.
        NOTE: reference is the full list of all instances of the related model e.g. menu_items for an orders form.
    */
    
    return (
        <>
            { Object.entries(reference).map((item: any, i) => {
                return (
                    <Form.Check
                        className={ `multi-select-field ${ name }` }
                        key={`${name}_${i}`}
                        type="checkbox"
                        label={ item[1].title }
                        name={ name }
                        value={ item[0] }
                        checked={ data[items_list].includes(Number(item[0])) }
                        onChange={e => multiDataHandler({
                            data: data,
                            values_obj: values_obj,
                            items_list: items_list,
                            item: String(item[0]),
                            checked: e.target.checked,
                            setObj: setObj
                        })}
                        {...options}
                    />
                )
            })}                    
        </>
    )
};


interface SelectMultiFieldGroupObj2 {
    name: string,                               // name of fieldset
    reference: object,                          // object containing the full list of items to select from
    state: Array<any>                  // state being updated
    stateSetter: SetStateAction<any>
};


export function SelectMultiFieldGroup2 ({name, reference, state, stateSetter}: SelectMultiFieldGroupObj2, options: object = {}) {
    /*
        Returns a multi-select checkbox list with labels for each item in `data_list`.
            1. When an item is checked, calls `multiDataHandler` to update relevate states.
            
        NOTE: data is the whole state object that is being edited/viewed.
        NOTE: reference is the full list of all instances of the related model e.g. menu_items for an orders form.
    */
    
    return (
        <>  
            { Object.entries(reference).map((item: any, i) => {
                return (
                    <Form.Check
                        className={ `multi-select-field ${ name }` }
                        key={`${name}_${i}`}
                        type="checkbox"
                        label={ item[1] }
                        name={ name }
                        // value={ Number(item[0]) }
                        onChange={(e) => {
                            if (e.target.checked && !state.includes(Number(item[0]))) {
                                stateSetter([...state, Number(item[0])])
                            } else if (!e.target.checked) {
                                stateSetter([...state].filter((id: number) => id !== Number(item[0])));
                            }
                        }}
                        checked={ state.includes(Number(item[0])) }
                        {...options}
                    />
                )
            })}                    
        </>
    )
};


interface InputMultiFieldGroupObj {
    type: string,                   // method to set state of object being updated/added
    label?: string,                  // displayed label of fieldset
    reference: object,              // object containing the full list of items to select from
    data: {[key: string]: any},     // object state being updated
    values_obj: string,             // name of object in `data` containing key-value pairs of selected items e.g. { menu_item: quantity }
    items_list: string,             // name of array in `data` containing ids of selected items e.g. menu_items
    name: string,                   // name of fieldset
    setObj: (obj: object) => void   // method to set state of object being updated/added
    feedback?: string                // feedback provided when invalid data is submitted
}


export function InputMultiFieldGroup ({type, reference, data, values_obj, items_list, name, setObj, feedback}: InputMultiFieldGroupObj, options: object = {}) {
    /*
        Returns a multi-input fieldset for selected items.
        
        NOTE: if type is number, `value` is casted to number.
    */

    return (
        <>
            { 
                Object.entries(reference).map((item: Array<any>, i) => {
                    
                    const new_options = Object.fromEntries(Object.entries(options).map((entry) => {
                        if (typeof(entry[1]) === "object") {
                            return [entry[0], entry[1][item[0]]]
                        }
                        return entry
                    }));

                    return (data[items_list] ?? []).includes(Number(item[0])) ? 
                    (
                        <Form.Group className={`multi-input-field ${ name }`} key={`${name}_${i}`}>
                            <Form.Control
                                type={ type }
                                name={ name }
                                defaultValue={ data[values_obj][String(item[0])] }
                                onChange={e => multiDataHandler({
                                    data: data,
                                    values_obj: values_obj,
                                    items_list: items_list,
                                    item: String(item[0]),
                                    value: (type === "number" ? Number(e.target.value) : e.target.value) ?? "",
                                    checked: true,
                                    setObj: setObj
                                })}
                                {...new_options}    
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">
                                { feedback }
                            </Form.Control.Feedback>
                        </Form.Group>
                    ) 
                    : <div className="field" key={i}></div>                                             
                })
            }
        </>

    )
};

interface InputMultiFieldGroup2Obj {
    type: string,                  // method to set state of object being updated/added
    name: string,                  // name of fieldset
    reference: object,              // object containing the full list of items to select from
    items_list: Array<number>,             // name of array in `data` containing ids of selected items e.g. menu_items
    ref: MutableRefObject<any>,
    feedback?: string                // feedback provided when invalid data is submitted
    // name: string,                   // name of field
    // data: {[key: string]: any},     // object state being updated
    // values_obj: string,             // name of object in `data` containing key-value pairs of selected items e.g. { menu_item: quantity }
    // setObj: (obj: object) => void   // method to set state of object being updated/added
}


export function InputMultiFieldGroup2 ({type, reference, items_list, name, ref, feedback}: InputMultiFieldGroup2Obj, options: object = {}) {
    /*
        Returns a multi-input fieldset for selected items.
        
        NOTE: if type is number, `value` is casted to number.
    */

    return (
        <>
            { 
                Object.entries(reference).map((item: Array<any>, i) => {
                    
                    const newOptions = Object.fromEntries(Object.entries(options).map((entry) => {
                        if (typeof(entry[1]) === "object") {
                            return [entry[0], entry[1][item[0]]]
                        }
                        return entry
                    }));

                    return items_list.includes(Number(item[0])) ? 
                    (
                        <Form.Group className={`multi-input-field ${ name }`} key={`${ name }_${i}`}>
                            <Form.Control
                                type={ type }
                                name={ name }
                                defaultValue={ ref.current.hasOwnProperty(String(item[0])) ? ref.current[String(item[0])] : 0 }
                                onChange={e => 
                                    ref.current = {...structuredClone(ref.current), [String(item[0])]: e.target.value}
                                }
                                {...newOptions}    
                            ></Form.Control>
                            <Form.Control.Feedback type="invalid">
                                { feedback }
                            </Form.Control.Feedback>
                        </Form.Group>
                    ) 
                    : <div className="field" key={i}></div>                                             
                })
            }
        </>

    )
};


type SetDeleteAlert = (confirm: boolean) => void;

type OnClickYes = (e: MouseEvent<HTMLElement>) => void;
type OnClickCancel = () => void;

export function DeleteAlert2 (onClickYes: OnClickYes, onClickCancel: OnClickCancel) {
    /*
    Returns an alert that confirms the user wants to delete the item.
    1. If cancel, dismiss alert and return to modal.
    2. If yes, send a delete request to the backend API and close modal.
    */
   
   return (
       <Alert onClose={() => onClickCancel() } dismissible>
            <Alert.Heading>
                Are you sure you want to delete this item?
            </Alert.Heading>
            <div className='alert-actions'>
                <Button type="button" className="cancel" onClick={() => onClickCancel() }>Cancel</Button>
                <Button type="button" className="yes" onClick={(e) => {
                    onClickYes(e);
                    onClickCancel();
                }}>Yes</Button>
            </div>
        </Alert>
    )
};

type HandleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, method: string, data: object) => void;
export function DeleteAlert (data: object, setDeleteAlert: SetDeleteAlert, handleSubmit: HandleSubmit) {
    /*
        Returns an alert that confirms the user wants to delete the item.
            1. If cancel, dismiss alert and return to modal.
            2. If yes, send a delete request to the backend API and close modal.
    */

    return (
        <Alert onClose={() => setDeleteAlert(false) } dismissible>
            <Alert.Heading>
                Are you sure you want to delete this item?
            </Alert.Heading>
            <div className='alert-actions'>
                <Button type="button" className="cancel" onClick={() => setDeleteAlert(false) }>Cancel</Button>
                <Button type="button" className="yes" onClick={(e: any) => {
                    handleSubmit(e, "delete", data)
                    setDeleteAlert(false);
                }}>Yes</Button>
            </div>
        </Alert>
    )
};



type Columns = Array<any>

interface Widths {
    [size: string]: Array<number>
};

export function ColumnsToRows (columns: Columns, widths: Widths) {
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

    return (
        <>
            {
                count.map((_: any, i: number) => {
                    return (
                        <Row key={`row_${i}`}>
                            { columns.map((col, index) => {
                                const colWidths = Object.fromEntries( Object.entries(widths).map(entry => [entry[0], entry[1][index]]));
                                return (
                                    <Col key={`col_${index}`} {...colWidths}>
                                        { col.props.children[i] }
                                    </Col>
                                )
                            })}
                        </Row>
                    )
                }) 
            }
        </>
    )
};


export function Submit () {
    return (
        <Row className="form-actions">
            <Button type="submit" className="submit">SUBMIT</Button>
        </Row>
    )

};


export function SubmitDelete (setDeleteAlert: SetDeleteAlert) {
    return (
        <Row className="form-actions">
            <Button type="submit" className="submit">SUBMIT</Button>
            <Button type="button" className="delete" onClick={() => setDeleteAlert(true)}>DELETE</Button>
        </Row>
    )

};



