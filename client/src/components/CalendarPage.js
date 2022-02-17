import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
const jwt = require('jsonwebtoken');
//import momentTimezonePlugin from '@fullcalendar/moment-timezone';
// import listPlugin from '@fullcalendar/list';
// import scrollGridPlugin from '@fullcalendar/scrollgrid';

// const loadData = () => {
//   const [spaceData, setSpaceData] = useState();
// };

class CalendarPage extends React.Component {


    state = {
        loadingSpace: true,
        space: null,
        inProgressTasks: [],
        upcomingTasks: [],
        completedTasks: [],
        tasks: null,
        loading: true,
        Goals: null,
        goals: [],
        events: []
        // adminEmail_ID: localStorage.getItem('adminUsername'),
        // userEmail_ID: localStorage.getItem('username')
    };

    events = []


    async componentDidMount() {
        //var events = [];
        //var temp = new Date();
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token')
            const getMyTasksURL = "https://spaces-server.herokuapp.com/viewSpaceEvents/" + `${token}`;
            axios.get(`${getMyTasksURL}`).then((res) => {
                this.setState({ events: res.data, loading: false });
                console.log(res.data)
            }).catch(err => {
                console.log(err);
            })
        }
    }

    render() {
        let sidebar;
        if (localStorage.getItem('token')) {
            var token = jwt.decode(localStorage.getItem('token'))
            console.log("Decoded Token: ", token)
            console.log(Date.now())
            if (Date.now() <= (token.exp * 1000)) {
                console.log("Token Not Expired")
                sidebar = <Sidebar />
            }
        }
        if (this.state.loading) {
            return (
                <div class="load_data">
                    <div class="loader"></div>
                    <br />
                    Loading
                </div>);
        }
        else {
            return (
                <Fragment>
                    <Navbar />
                    <div class="wrapper">
                        {sidebar}
                        <div class="main_content">
                            <div class="header">
                                <h1>Calendar</h1>
                                <br />
                                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                            </div>
                            {
                                console.log("1", this.state.events)
                            }
                            {
                                console.log("2", this.events)
                            }
                            <div class="calendar">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin,
                                        //  momentTimezonePlugin
                                    ]}
                                    // timeZone='Asia/Kolkata'
                                    initialView="dayGridMonth"
                                    weekends={true}

                                    events={this.state.events}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                    }}
                                    expandRows={true}
                                    height={' 80vh'}

                                />

                                {/* <p>Space name: <b>{this.state.space.name}</b></p>
                                    <p>Start date: <b>{st.toDateString()}  </b></p>
                                    <p>Expected Finish date: <b>{ft.toDateString()}</b></p>
                                    <p>Space id: <b>{this.state.space.uniqueSpaceId}</b></p> */}
                            </div>
                        </div>
                    </div>
                </Fragment>
            );

        }


    }
}

export default CalendarPage