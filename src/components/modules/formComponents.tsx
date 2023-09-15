import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { MutableRefObject, RefObject, SetStateAction, MouseEvent, ChangeEvent, Dispatch} from "react";

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


interface EditFieldGroup2Input {
    name: string,               // name of field 
    label: string,              // display label of field group
    ref: RefObject<HTMLInputElement>,
    type?: string,               // type of input
    defaultValue?: string,
    feedback?: string           // feedback provided when invalid data is submitted
};

export function EditFieldGroup2 ({name, label, ref, type="text", defaultValue="", feedback=""}: EditFieldGroup2Input, options: object = {}) {
    /* 
        Returns a simple editable form field with a label.

        NOTE: if type is number, `value` is casted to number.
    */

    return (    
        <Form.Group className={ `field-group ${ name }` } as="div">
            <Form.Label column>{ label }</Form.Label>
            <Form.Control
                name={ name }
                defaultValue={ defaultValue }
                type={ type }
                ref={ ref }
                autoComplete="off"
                {...options}
            />                                
            <Form.Control.Feedback type="invalid">
                { feedback }
            </Form.Control.Feedback>
        </Form.Group>
    )
};


interface SelectMultiFieldGroupObj2 {
    name: string,                               // name of fieldset
    reference: {[key: string | number]: any},                          // object containing the full list of items to select from
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
    
    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;

        if (checked && !state.includes(value)) {
            stateSetter([...state, value]);
        } else {
            stateSetter([...state].filter((id: string) => id !== value));
        }
    };
    
    return (
        <>  
            { 
                Object.entries(reference).map((item: any, i) => {
                    return (
                        <Form.Check
                            className={ `multi-select-field ${ name }` }
                            key={`${name}_${i}`}
                            type="checkbox"
                            label={ item[1] }
                            name={ name }
                            value={ Number(item[0]) }
                            onChange={(e) => handleCheck(e)}
                            defaultChecked={ state.includes(Number(item[0]))}
                            {...options}
                        />
                    )
                }
            )}                    
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

    const changeHandler = (e: ChangeEvent<any>, key: string) => {
        ref.current = {...structuredClone(ref.current), [key]: Number(e.target.value) }
    };

    return (
        <>
            { 
                Object.entries(reference).map((item: Array<any>, i) => {
                    /*
                        E.g. If an object of max values are provided, get the corresponding max value for each item.
                    */
                    
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
                                defaultValue={ ref.current[item[0]] ?? 0 }
                                onChange={e => changeHandler(e, item[0])}
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

interface DeleteAlert2Type {
    onClickYes: () => void,
    onClickCancel: () => void
}

export function DeleteAlert2 ({onClickYes, onClickCancel}: DeleteAlert2Type) {
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
                <Button type="button" className="yes" onClick={() => onClickYes()}>Yes</Button>
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

interface SubmitType {
    buttonText?: string | undefined
};

export function Submit ({buttonText}: SubmitType) {
    return (
        <div className="form-actions">
            <Button type="submit" className="button">{ buttonText ?? "Submit" }</Button>
        </div>
    )

};

interface SubmitDeleteType {
    setDeleteAlert: Dispatch<SetStateAction<boolean>>,
    submitButtonText?: string | undefined,
    deleteButtonText?: string | undefined
};


export function SubmitDelete ({setDeleteAlert, submitButtonText="Submit", deleteButtonText="Delete"}: SubmitDeleteType) {
    return (
        <Row className="form-actions">
            <Button type="submit" className="submit">{ submitButtonText }</Button>
            <Button type="button" className="delete" onClick={() => setDeleteAlert(true)}>{ deleteButtonText }</Button>
        </Row>
    )

};



