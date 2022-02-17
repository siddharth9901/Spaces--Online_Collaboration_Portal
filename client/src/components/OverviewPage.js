import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";
import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');
//import { NavLink, useHistory } from 'react-router-dom';

class OverviewPage extends React.Component {

  state = {
    loadingSpace: true,
    space: null,
    inProgressTasks: [],
    upcomingTasks: [],
    completedTasks: [],
    tasks: null,
    loadingTasks: true,
    Goals: null,
    goals: []
    // adminEmail_ID: localStorage.getItem('adminUsername'),
    // userEmail_ID: localStorage.getItem('username')
  };


  async componentWillMount() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token')
      //GET OVERVIEW DATA:--->
      const getSpaceDataURL = "https://spaces-server.herokuapp.com/overview/" + `${token}`;
      axios.get(`${getSpaceDataURL}`).then((res) => {
        console.log("Space Details: ", res.data)
        this.setState({ space: res.data, loadingSpace: false });
        localStorage.setItem('spaceName', res.data.name)
      }).catch(err => {
        console.log(err);
      })

      //GET TASKS:-->
      const getMyTasksURL = "https://spaces-server.herokuapp.com/viewSpaceTasks/" + `${token}`
      axios.get(`${getMyTasksURL}`).then((res) => {
        console.log("Tasks: ", res.data)
        this.setState({ tasks: res.data, loadingTasks: false });
        console.log(this.state.tasks);
        var ongoing = []
        var upcoming = []
        var completed = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status == "In Progress") {
            ongoing.push(res.data[i]);
          } else if (res.data[i].status == "Upcoming") {
            upcoming.push(res.data[i]);
          } else {
            completed.push(res.data[i]);
          }
        }
        //console.log(ongoing);
        this.setState({ inProgressTasks: ongoing, upcomingTasks: upcoming, completedTasks: completed });
        console.log(this.state.inProgressTasks);
      }).catch(err => {
        console.log(err);
      })


      //GET MILESTONE:-->
      const getSpaceGoalsURL = "https://spaces-server.herokuapp.com/viewSpaceGoals/" + `${token}`;
      console.log("Getting Data");
      axios.get(`${getSpaceGoalsURL}`).then((res) => {
        console.log("Goals", res.data)
        var Goals = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status == "Current") {
            Goals.push(res.data[i]);
          }
        }
        // console.log(res);
        // console.log("loaded");
        this.setState({ Goals: res.data, loading: false });
        console.log(this.state.Goals);
        this.setState({ goals: Goals });
        console.log(this.state.goals);
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
        console.log(token.admin)
        sidebar = <Sidebar />
      }
      else {
        console.log("Token Expired")
        localStorage.clear();
        return (
          <>
            {/* window.alert("Your Session Has Expired. Please Login"); */}
            <Redirect to='/' />
          </>
        )
      }
    }
    else {
      localStorage.clear();
      return (
        <>
          {/* window.alert("Your Session Details are not Available. Please Login"); */}
          <Redirect to='/' />
        </>
      )
    }
    if (this.state.loadingSpace || this.state.loadingTasks || this.state.loading) {
      return (<div class="load_data">
        <div class="loader"></div>
        <br />
        Loading
      </div>);
    }
    else {
      return (
        <Fragment>
          {/* {redirect} */}
          <Navbar />
          <div class="wrapper">
            {sidebar}

            <div class="main_content">

              <div class="header" >


                <h1>Overview</h1>
                <br />
                <div class="header-in-detail">
                  <p>Space name: <b>{this.state.space.name}</b></p>
                  <p>Space id: <b>{this.state.space.uniqueSpaceId}</b></p>
                </div>

              </div>

              <div class="info">
                <br />                    <br />                      <br />
                <div class="overview-cards-row">
                  <div class="overview-space-description-card">
                    <div class="overview-space-description-card-title">
                      <h1>Description</h1>
                    </div>
                    <hr />
                    <div class="overview-space-description-card-description">
                      <p>{this.state.space.spaceDescription}</p>
                    </div>
                  </div>




                  <div class="overview-space-tasks-card">
                    <div class="overview-space-tasks-card-title">
                      <h1>Upcoming</h1>
                    </div>

                    {this.state.upcomingTasks.map((upcomingTask, index) => (
                      <div key={index} class="overview-space-tasks-card-items">
                        <p>{upcomingTask.name}</p>
                      </div>
                    ))}

                    {/* <div class="overview-space-tasks-card-items">
                      <p>To do Task 2</p>
                    </div> */}



                  </div>



                  <div class="overview-space-tasks-card">
                    <div class="overview-space-tasks-card-title">
                      <h1>In progress</h1>
                    </div>

                    {this.state.inProgressTasks.map((inProgressTask, index) => (
                      <div key={index} class="overview-space-tasks-card-items">
                        <p>{inProgressTask.name}</p>
                      </div>
                    ))}
                  </div>



                  <div class="overview-space-tasks-card">
                    <div class="overview-space-tasks-card-title">
                      <h1>Completed</h1>
                    </div>

                    {this.state.completedTasks.map((completedTask, index) => (
                      <div key={index} class="overview-space-tasks-card-items">
                        <p>{completedTask.name}</p>
                      </div>
                    ))}


                    {/* <div class="overview-space-tasks-card-items">
                      <p>Completed Task 3</p>
                    </div> */}

                  </div>

                </div>

                <hr />
                <br />


                <div class="goals-cards-row">

                  <div class="goals-card" onClick={() => window.open('/CalendarPage', "_self")}>
                    <div class="goals-card-title">
                      <h1>Calendar</h1>
                      <Link to="/CalendarPage"><i class="fa fa-calendar"></i></Link>

                    </div>

                    <div class="goals-card-description">
                      <p>This module allows user to view all the tasks and goals assigned to them in a calendar view</p>
                    </div>
                  </div>

                  <div class="goals-card" onClick={() => window.open('/TasksPage', "_self")}>
                    <div class="goals-card-title">
                      <h1>Tasks</h1>
                      <Link to="#"><i class="fa fa-bars"></i></Link>
                    </div>

                    <div class="goals-card-description">
                      <p>This module allows project leader to assign tasks to members. Members can see tasks assigned to them</p>
                    </div>
                  </div>

                  <div class="goals-card" onClick={() => window.open('/TeamManagement', "_self")}>
                    <div class="goals-card-title">
                      <h1>Members</h1>
                      <Link to="#"><i class="fa fa-users"></i></Link>
                    </div>

                    <div class="goals-card-description">
                      <p>The module shows the list of all team members with their skill set in the form of a card view.</p>
                    </div>
                  </div>

                  <div class="goals-card" onClick={() => window.open('/GoalsPage', "_self")}>
                    <div class="goals-card-title">
                      <h1>Goals</h1>
                      <Link to="#"><i class="fa fa-flag"></i></Link>
                    </div>

                    <div class="goals-card-description">
                      <p>The module shows all the major goals of project and their completion dates.</p>
                    </div>
                  </div>

                  <div class="goals-card" onClick={() => window.open('/ConferencingPage', "_self")}>
                    <div class="goals-card-title">
                      <h1>Conferencing</h1>
                      <Link to="#"><i class="fa fa-comments"></i></Link>
                    </div>

                    <div class="goals-card-description">
                      <p>The module allows communication between members. Members can text or call each other.</p>
                    </div>
                  </div>

                  <div class="goals-card" onClick={() => window.open('/FlowChartPage', "_self")}>
                    <div class="goals-card-title">
                      <h1>Flow Chart</h1>
                      <Link to="#"><i class="fa fa-sitemap"></i></Link>
                    </div>

                    <div class="goals-card-description">
                      <p>The module allows users to create flow charts and these flowcharts can be saved to the database. </p>
                    </div>
                  </div>

                  <div class="goals-card" onClick={() => window.open('/EditorPage', "_self")}>
                    <div class="goals-card-title">
                      <h1>Editor</h1>
                      <Link to="#"><i class="fas fa-laptop-code"></i></Link>
                    </div>

                    <div class="goals-card-description">
                      <p>The module will give a realtime collaborative environment to users to code or write some text. </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      );

    }


  }
}

export default OverviewPage