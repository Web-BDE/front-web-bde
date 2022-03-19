import { Link } from "remix"
import PirateIcon from "~/shapes/pirateIcon"

export type Selection =
    | null
    | "AGENDA"
    | "CHALLENGES"
    | "GOODIES"
    | "USER"

export function Nav({
    selection
}: {
    selection?: Selection,
}) {
    return (
        <nav className="nav">
            <Link
                to="/agenda"
                className={"nav__link" + (selection == "AGENDA" ? " nav__link--selected" : "")}
            >Agenda</Link>
            <Link
                to="/challenges"
                className={"nav__link" + (selection == "CHALLENGES" ? " nav__link--selected" : "")}
            >Défis</Link>
            {/* <Link
                to="/goodies"
                className={"nav__link" + (selection == "GOODIES" ? " nav__link--selected" : "")}
            >Goodies</Link> */}
            <Link
                to="/user"
                className={"nav__link_icon" + (selection == "USER" ? " nav__link_icon--selected" : "")}
            >
                <PirateIcon className="nav__account_icon" />
            </Link>
        </nav>
    )
}