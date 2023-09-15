import { useState, useContext, FormEvent } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { SubmitDelete, Submit, DeleteAlert2 } from "./formComponents";
import { GlobalContext } from "../pages/App";
import { dataAPI } from "../modules/axiosInstances";
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
    submitButtonText?: string,
    deleteButtonText?: string,
    className?: string
};

interface ModalComponentType {
    title: string,
    Form: React.FunctionComponent,
    className?: string
};

export function ModalTemplate ({className, title }: ModalComponentType) {

    const { theme: [theme], feedback: [feedback], loading: [loading] } = useContext(GlobalContext);

    return (
        <Modal className={`modal-form ${ theme } ${ className ?? ""}`} 
            show={ true }
        >
            
            <Modal.Header closeButton>
                <h2 className="title">{ title }</h2>
            </Modal.Header>

            <Modal.Body>

                <div className="spinner">
                    { loading && <Spinner animation="grow"/> } 
                </div>

                <Row className="feedback">
                    <ul>
                        { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                    </ul>
                </Row>

                <Form />

                
            </Modal.Body>
        </Modal>

    )
};

export function FormModal ({title, Fields, returnURL, deleteURL, submitButtonText, deleteButtonText, submitRequest, className}: FormModalComponentObj) {
    
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
            // Set validated true after first submit and not valid
            setValidated(true);
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

    };    
    

    return (
        <Modal className={`modal-form ${ theme } ${ className ?? ""}`} 
            show={ true }
            onHide={() => navigate(returnURL)}
        >
            
            <Modal.Header closeButton>
                <h2 className="title">{ title }</h2>
            </Modal.Header>

            <Modal.Body>

                <div className="spinner">
                    { loading && <Spinner animation="grow"/> } 
                </div>

                <Row className="feedback">
                    <ul>
                        { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
                    </ul>
                </Row>

                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    <Fields />

                    <SubmitDelete setDeleteAlert={ setShowDelete } submitButtonText={ submitButtonText } deleteButtonText={ deleteButtonText } />
                </Form>

                {
                    showDelete &&
                    <DeleteAlert2 
                        onClickYes={() => {
                            dataAPI.delete(deleteURL);
                            navigate(returnURL);
                        }}
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

            <Row className="feedback">
                <ul>
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