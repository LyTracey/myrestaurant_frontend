import { useContext } from "react"
import { GlobalContext } from "../pages/App"
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export function DisplayFeedback () {

    const { feedback: [feedback] } = useContext(GlobalContext);

    return (
        <div className="feedback">
            <ul >
                { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
            </ul>
        </div>
    )
};

interface TooltipType {
    Header: () => JSX.Element,
    Contents: () => JSX.Element
};

export function Tooltip ({ Header, Contents }: TooltipType) {

    return (
        <div className="tooltip">
            <div className="tooltip-header">
                <Header />
            </div>
            <div className="tooltip-body">
                <Contents />
            </div>
        </div>
    )
};

interface DeleteAlertType {
    onClickYes: () => void,
    onClickCancel: () => void
}

export function DeleteAlert ({onClickYes, onClickCancel}: DeleteAlertType) {
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