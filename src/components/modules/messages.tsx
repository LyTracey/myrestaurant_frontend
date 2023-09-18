import ICONS from "../../data/icons";
import "../../styles/messages.scss";

export function SuccessfullyRegistered () {

    const { ConfirmIcon } = ICONS;

    return (
        <div className="page message">
            <ConfirmIcon className="icon"/>
            <h2 className="title">Successfully registered! Please login.</h2>
        </div>
    )
}