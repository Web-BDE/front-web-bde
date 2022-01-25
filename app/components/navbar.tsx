import { Link } from "remix";

export default function NavBar () {
    return(
        <div>
            <h1>Nav Bar</h1>
            <Link to="/">Home</Link>
            <Link to="/challenges">Challenges</Link>
            <Link to="/challenges/admin">Challenges Admin</Link>
            <Link to="/challenges/1">Challenge</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/shop/admin">Shop Admin</Link>
            <Link to="/shop/1">Goodies</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>
    )
}