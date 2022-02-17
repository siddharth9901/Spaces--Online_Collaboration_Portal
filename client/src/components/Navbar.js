import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';
import { Link } from "react-router-dom";
const jwt = require('jsonwebtoken');


const Navbar = () => {
    const history = useHistory();
    //const [sidebarType, setSidebarType] = useState(localStorage.getItem("sidebar"))
    const { value, setValue } = useContext(SidebarContext);
    let spaceName = ""
    if (localStorage.getItem('token')) {
        var token = jwt.decode(localStorage.getItem('token'))
        console.log("Decoded Token: ", token)
        console.log(Date.now())
        if (Date.now() <= (token.exp * 1000)) {
            console.log("Navbar loaded")
            spaceName = token.spaceName;
        }
    }

    return (
        <nav class="top-navbar">
            <div class="navbar-heading">
                <div class="top-navbar-menu-container" id="top_navbar_menu_container">
                    <button onClick={() => {
                        console.log("click 1")
                        const value = localStorage.getItem(("sidebar"))
                        if (value == "expanded") {
                            console.log("If applied ")
                            localStorage.setItem("sidebar", "collapsed");
                            //setSidebarType("collapsed");
                            setValue("collapsed")
                        }
                        else {
                            localStorage.setItem("sidebar", "expanded");
                            //setSidebarType("expanded");
                            setValue("expanded")
                        }
                    }}
                        // onclick={ ()=>{
                        //         console.log("click 1")
                        //         if(sidebar=="expanded")
                        //         {
                        //             console.log("If applied ")
                        //             setSidebar("collapsed");
                        //             localStorage.setItem("sidebar","collapsed");
                        //         }
                        //         else{
                        //             setSidebar("expanded");
                        //             localStorage.setItem("sidebar","expanded");
                        //         }
                        //     }}
                        name="button"><i class="fa fa-bars" aria-hidden="true"></i></button>

                </div>
                <h1><Link to="/OverviewPage" target="_self" style={{ "text-decoration": "none" }}>{spaceName}</Link></h1>
            </div>

            <div class="navbar-buttons">
                <button class="logout-button">
                    <Link to="/ProfilePage"> <i class="fa fa-user"></i></Link>

                </button>
                <button class="logout-button" onClick={() => {
                    localStorage.clear();
                    history.push("/");
                }}><i class="fa fa-power-off"></i></button>
            </div>

        </nav >
    )
}

export default Navbar