import { useState, useContext, FormEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Submit } from "./formComponents";
import { GlobalContext} from "../App";
import Row from "react-bootstrap/Row";


interface FormModalComponentObj {
    title: string,
    Fields: React.FunctionComponent,
    returnURL: string,
    submitRequest: () => void

};


function FormModal ({title, Fields, returnURL, submitRequest}: FormModalComponentObj) {
    
    const { theme: [theme], navigate, feedback: [feedback]} = useContext(GlobalContext);
    const [validated, setValidated] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>, request: () => void) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (form.checkValidity()) {
            // Check validity
            e.stopPropagation();
        } else {
            // If valid, send request
            request();
        } 
        
        // Set validated true after first submit
        setValidated(true);
    };    
    

    return (
        <Modal className={`inventory-form page-form ${ theme }`} 
            show={ true }
            onHide={() => navigate.current(returnURL)}
        >
            
            <Modal.Header closeButton>
                <Modal.Title>{ title }</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Row>
                    <ul className="error">
                        { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                    </ul>
                </Row>

                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e, submitRequest)} >
                    <Fields />

                    <Submit />
                </Form>
            </Modal.Body>
        </Modal>

    )
};

export default FormModal;