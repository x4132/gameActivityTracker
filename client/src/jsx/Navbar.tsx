import { Link } from "react-router-dom";

export default function Navbar() {
    return <nav className="navbar navbar-expand navbar-dark bg-dark border-bottom p-2" >
        <div className="container-fluid" >
            <Link to="/" className="navbar-brand" >Time Tracker</Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" >
                <li className="nav-item" >
                    <Link to="/history" className="nav-link" >History</Link>
                </li>
                <li className="nav-item" >
                    <Link to="/addgame" className="nav-link" >Add a game</Link>
                </li>
            </ul>
        </div>
    </nav>
}