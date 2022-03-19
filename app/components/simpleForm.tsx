import { Form, FormMethod } from "remix"
import Button from "./button"
import Separator from "./separator"

export default function SimpleForm({
    children,
    verticalMode = false,
    method = "post",
}: {
    children: JSX.Element | JSX.Element[],
    verticalMode?: boolean,
    method?: FormMethod,
}) {
    let handleSave = async function () {

    }
    return (
        <Form method={method} className={"simple_form" + (verticalMode ? " simple_form--vertical" : "")}>
            <div className="simple_form__inputs">{children}</div>
            <Separator width="100px" height="100px" />
            <Button onClick={event => handleSave()}>Sauver</Button>
        </Form>
    )
}