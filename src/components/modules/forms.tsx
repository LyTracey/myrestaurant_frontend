import { useState, useContext, FormEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Submit, DeleteAlert2 } from "./formComponents";
import { GlobalContext } from "../pages/App";
import { dataAPI } from "../pages/App";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { errorFormatter } from "../../utils/formatUtils";
import Spinner from "react-bootstrap/Spinner";
import "../../styles/form.scss";


interface FormModalComponentObj {
    title: string,
    Fields: React.FunctionComponent,
    returnURL: string,
    submitRequest: () => Promise<any>
    deleteURL: string,
    buttonText?: string,
    className?: string
};


export function FormModal ({title, Fields, returnURL, deleteURL, buttonText, submitRequest, className}: FormModalComponentObj) {
    
    const { theme: [theme],  feedback: [feedback], loading: [loading, setLoading]} = useContext(GlobalContext);
    const [validated, setValidated] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        
        if (!form.checkValidity()) {
            // Check validity
            e.stopPropagation();
        } else {
            // If valid, send request
            setLoading(true);
            try {
                await submitRequest().then(() => navigate(returnURL));
            } catch (error: any) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } 

        // Set validated true after first submit
        setValidated(true);
    };    
    

    return (
        <Modal className={`modal-form ${ theme } ${ className ?? ""}`} 
            show={ true }
            onHide={() => navigate(returnURL)}
        >
            
            <Modal.Header closeButton>
                <h4 className="title">{ title }</h4>
            </Modal.Header>

            <Modal.Body>

                <div className="spinner">
                    { loading && <Spinner animation="grow"/> } 
                </div>

                <ul className="error">
                    { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                </ul>

                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    <Fields />

                    <Submit buttonText={ buttonText } />
                </Form>

                {
                    showDelete &&
                    <DeleteAlert2 
                        onClickYes={() => dataAPI.delete(deleteURL)}
                        onClickCancel={() => {
                            setShowDelete(false);
                            navigate(returnURL);
                        }}
                    />

                }
            </Modal.Body>
        </Modal>

    )
};

interface FormTemplateType {
    title: string,
    Fields: React.FunctionComponent,
    redirectURL?: string,
    submitRequest: () => Promise<any>
    buttonText?: string,
    className?: string
};


export function FormTemplate ({title, Fields, redirectURL, buttonText, submitRequest, className}: FormTemplateType ) {
    
    const { theme: [theme], feedback: [feedback, setFeedback], loading: [loading, setLoading]} = useContext(GlobalContext);
    const [validated, setValidated] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;


        if (!form.checkValidity()) {
            // Check validity
            e.stopPropagation();
        } else {
            // If valid, send request
            setLoading(true);
            try {
                await submitRequest();
                if (redirectURL) {
                    navigate(redirectURL);
                }
            } catch (error: any) {
                setFeedback(errorFormatter(error));
            } finally {
                setLoading(false);
            }
        } 

        // Set validated true after first submit
        setValidated(true);
    };    
    

    return (
        <div className={`inline-form ${ theme } ${ className }`}>
            <h2 className="title">{ title }</h2>

            <div className="spinner">
                { loading && <Spinner animation="grow"/> } 
            </div>

            <Row>
                <ul className="error">
                    { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                </ul>
            </Row>

            <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                <Fields />

                <Submit buttonText={ buttonText } />
            </Form>
        </div>

    )
};