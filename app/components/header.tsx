import { Link } from "remix";

import { Nav, Selection } from "~/components/nav";

export default function Header({
    location = "/",
}: {
    location?: string,
}) {
    let selection: Selection;
    switch (location) {
        case "/user":
            selection = "USER";
            break;
        case "/goodies":
            selection = "GOODIES";
            break;
        case "/agenda":
            selection = "AGENDA";
            break;
        case "/challenges":
            selection = "CHALLENGES";
            break;
        default:
            selection = null;
            break;
    }

    return (
        <header className="header">
            <div className="header__inner">
                <Link to="/" className="header__title">
                    <img src="/assets/images/logo.png" alt="Piratech icon" className="header__icon" />
                    <h1 className="header__text">Flibustech</h1>
                </Link>
                <Nav selection={selection} />
            </div>
        </header>
    );
}