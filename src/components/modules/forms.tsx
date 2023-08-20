import { useState, useContext, FormEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Submit, DeleteAlert2 } from "./formComponents";
import { GlobalContext } from "../pages/App";
import { dataAPI } from "../pages/App";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { errorFormatter } from "../../utils/formatUtils";
import { HashLoader } from "react-spinners";


interface FormModalComponentObj {
    title: string,
    Fields: React.FunctionComponent,
    returnURL: string,
    submitRequest: () => Promise<any>
    deleteURL: string,
    buttonText?: string
};


export function FormModal ({title, Fields, returnURL, deleteURL, buttonText, submitRequest}: FormModalComponentObj) {
    
    const { theme: [theme],  feedback: [feedback, setFeedback], loading: [loading, setLoading]} = useContext(GlobalContext);
    const [validated, setValidated] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Reset feedback
        setFeedback([]);

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
                setFeedback(errorFormatter(error));
            } finally {
                setLoading(false);
            }
        } 

        // Set validated true after first submit
        setValidated(true);
    };    
    

    return (
        <Modal className={`inventory-form page-form ${ theme }`} 
            show={ true }
            onHide={() => navigate(returnURL)}
        >
            
            <Modal.Header closeButton>
                <Modal.Title>{ title }</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <HashLoader color="#F3ECD2" loading={ loading }/>

                <Row>
                    <ul className="error">
                        { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                    </ul>
                </Row>

                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    <Fields />

                    <Submit buttonText={ buttonText } />
                </Form>

                <DeleteAlert2 
                    onClickYes={() => dataAPI.delete(deleteURL)}
                    onClickCancel={() => navigate(returnURL)}
                    
                />
            </Modal.Body>
        </Modal>

    )
};

interface FormTemplateType {
    title: string,
    Fields: React.FunctionComponent,
    redirectURL?: string,
    submitRequest: () => Promise<any>
    buttonText?: string
};


export function FormTemplate ({title, Fields, redirectURL, buttonText, submitRequest}: FormTemplateType ) {
    
    const { feedback: [feedback, setFeedback], loading: [loading, setLoading]} = useContext(GlobalContext);
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
        <>
            <h2 className="title">{ title }</h2>

            <HashLoader color="#F3ECD2" loading={ loading }/>

            <Row>
                <ul className="error">
                    { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                </ul>
            </Row>

            <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                <Fields />

                <Submit buttonText={ buttonText } />
            </Form>
        </>

    )
};