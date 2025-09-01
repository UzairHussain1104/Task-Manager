import {Link} from "react-router-dom";
import "./css/navbar.css"

function Navbar(){
    const handleSignOut = () => {
        localStorage.removeItem("token")
    };

    return(
        <section className = "header">
            <nav className = "topbar">
                <ul>
                    <li><Link to = '/' onClick={handleSignOut} >Sign out </Link></li>
                    <li><Link to ="/dashboard">Dashboard</Link></li>
                    <li><Link to ="/dashboard/createTask">Create Task</Link></li>
                </ul>
            </nav>
        </section>
    );
}

export default Navbar;