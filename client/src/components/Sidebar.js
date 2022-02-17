import React, { useContext } from 'react'
import { SidebarContext } from './SidebarContext';
import { Link } from "react-router-dom";
const jwt = require('jsonwebtoken');
export const Sidebar = () => {
    if (localStorage.getItem('token')) {
        var admin_mini;
        var admin_expanded;
        var token = jwt.decode(localStorage.getItem('token'));
        if (token.admin) {
            admin_mini = <li><Link to="/CostsPage"><i class="fa fa-credit-card"></i><p>Costs</p></Link></li>
            admin_expanded = <li><Link to="/CostsPage"><i class="fa fa-credit-card"></i>Costs</Link></li>
        }
        else {
            admin_mini = null
            admin_expanded = null
        }
    }
    const { value, setValue } = useContext(SidebarContext);
    return (
        // <div class="wrapper">
        <>
            <div class="mini-sidebar" id="mini_sidebar"
                style={{ "display": value == "expanded" ? "none" : "flex" }}
            >

                <ul>
                    <li><Link to="/OverviewPage"><i class="fa fa-compass"></i><p>Overview</p></Link></li>
                    <li><Link to="/CalendarPage"><i class="fa fa-calendar"></i><p>Calendar</p></Link></li>
                    <li><Link to="/TasksPage"><i class="fa fa-bars"></i><p>Tasks</p></Link></li>
                    <li><Link to="/TeamManagement"><i class="fa fa-users"></i><p>Team Members</p></Link></li>
                    <li><Link to="/GoalsPage"><i class="fa fa-flag"></i><p>Goals</p></Link></li>
                    {admin_mini}
                    <li><Link to="/ResourcesPage"><i class="fa fa-clone"></i><p>Resources</p></Link></li>
                    <li><Link to="/ConferencingPage"><i class="fa fa-comments"></i><p>Conferencing</p></Link></li>
                    <li><Link to="/FlowChartPage"><i class="fa fa-sitemap"></i><p>Flow Chart</p></Link></li>
                    <li><Link to="/EditorPage"><i class="fas fa-laptop-code"></i><p> Editor</p></Link></li>
                    {/* <li><Link to="/MainPage"><i class="fas fa-sign-out-alt" ></i><p>Switch Space</p></Link></li> */}
                </ul>

            </div>

            <div class="sidebar" id="sidebar"
                style={{ "display": value == "expanded" ? "block" : "none" }}
            >

                <ul>
                    <li><Link to="/OverviewPage"><i class="fa fa-compass"></i>Overview</Link></li>
                    <li><Link to="/CalendarPage"><i class="fa fa-calendar"></i>Calendar</Link></li>
                    <li><Link to="/TasksPage"><i class="fa fa-bars"></i>Tasks</Link></li>
                    <li><Link to="/TeamManagement"><i class="fa fa-users"></i>Team Members</Link></li>
                    <li><Link to="/GoalsPage"><i class="fa fa-flag"></i>Goals</Link></li>
                    {admin_expanded}
                    <li><Link to="/ResourcesPage"><i class="fa fa-clone"></i>Resources</Link></li>
                    <li><Link to="/ConferencingPage"><i class="fa fa-comments"></i>Conferencing</Link></li>
                    <li><Link to="/FlowChartPage"><i class="fa fa-sitemap"></i>Flow Chart</Link></li>
                    <li><Link to="/EditorPage"><i class="fas fa-laptop-code"></i> Editor</Link></li>
                    {/* <li><Link to="/MainPage"><i class="fas fa-sign-out-alt" style={{ "padding-left": "4px", "padding-right": "4px" }}></i>Switch Space</Link></li> */}
                </ul>

            </div>
        </>
    )
}

export default Sidebar