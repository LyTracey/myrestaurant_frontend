import Row from "react-bootstrap/Row";


export function DisplayFeedback (feedback: string[]) {
    return (
        <Row>
            <ul className="error">
                { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
            </ul>
        </Row>
    )
};