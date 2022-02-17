import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');

class TasksPage extends React.Component {

  state = {
    loadingTasks: true,
    space: null,
    totalTimeSpent: 0,
    displayAddTask: { display: 'none' },
    displayEditTask: { display: 'none' },
    Inprogress_display: { display: 'flex' },
    Upcoming_display: { display: 'none' },
    Completed_display: { display: 'none' },
    Inprogress_TabLink: 'tablinks active',
    Upcoming_TabLink: 'tablinks',
    Completed_TabLink: 'tablinks',
    inProgressTasks: [],
    upcomingTasks: [],
    completedTasks: [],
  };

  constructor(props) {
    super(props);
    // create a ref to store the DOM element
    // this.newMemberEmailID = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemoval = this.handleRemoval.bind(this);
    this.name = React.createRef();
    this.emails = React.createRef();
    this.time = React.createRef();
    this.status = React.createRef();
    this.startDate = React.createRef();
    this.endDate = React.createRef();
    this.Editname = React.createRef();
    this.Editemails = React.createRef();
    this.Edittime = React.createRef();
    this.Editstatus = React.createRef();
    this.EditstartDate = React.createRef();
    this.EditendDate = React.createRef();
    this.currentObjectID = "";
    //this.removeMemberEmailID = React.createRef();
    // this.handleRemoval = this.handleRemoval.bind(this);
    // this.handleClick() = this.handleClick.bind(this)
  }

  async getData() {
    if (localStorage.getItem('token')) {
      var token = localStorage.getItem('token');
      axios.get("https://spaces-server.herokuapp.com/viewSpaceTasks/" + `${token}`).then((res) => {
        this.setState({ tasks: res.data, loadingTaks: false });
        //console.log(this.state.tasks);
        var ongoing = []
        var upcoming = []
        var completed = []
        var tt = 0;
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status == "In Progress") {
            ongoing.push(res.data[i]);
          } else if (res.data[i].status == "Upcoming") {
            upcoming.push(res.data[i]);
          } else {
            tt = tt + (res.data[i].time);
            completed.push(res.data[i]);
          }
        }
        this.setState({ totalTimeSpent: tt });
        this.setState({ inProgressTasks: ongoing, upcomingTasks: upcoming, completedTasks: completed });
        // console.log(this.state.inProgressTasks);
      }).catch(err => {
        console.log(err);
      })
    }
  }
  async componentDidMount() {
    //GET ALL TASKS FOR MANAGER
    this.getData();
  }

  emailIDs = []
  // spaceID = localStorage.getItem("spaceID");
  taskName = ""
  tasktime = ""
  taskstatus = ""
  taskstartDate = ""
  taskendDate = ""
  taskobjectID = ""
  // AdminId = localStorage.getItem("adminUsername");

  assigned = { display: 'none' };
  deleteButton = { display: 'none' };

  //FUNCTIONS FOR BUTTON CLICK:------>

  addTaskButtonClick = () => {
    this.setState({ displayAddTask: { display: 'block' } });
  }

  handleEdit(e) {
    e.preventDefault();
    this.emailIDs = this.Editemails.current.value;
    this.taskName = this.Editname.current.value;
    this.tasktime = this.Edittime.current.value;
    this.taskstatus = this.Editstatus.current.value;
    this.taskstartDate = this.EditstartDate.current.value;
    this.taskendDate = this.EditendDate.current.value;
    this.taskobjectID = this.currentObjectID;
    this.editTaskButtonEdit();
    this.editTaskButtonCancel();
    // setTimeout(() => {
    //   this.getData()
    // }, 400)
  }

  editTaskButtonEdit = async () => {
    // e.preventDefault();
    const res = await fetch("https://spaces-server.herokuapp.com/updateTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        memberEmailIDs: this.emailIDs,
        taskName: this.taskName,
        time: this.tasktime,
        status: this.taskstatus,
        startDate: this.taskstartDate,
        endDate: this.taskendDate,
        taskDocID: this.taskobjectID,
        token: localStorage.getItem('token')
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log(" Task Editted Successfuly");
      this.getData();
    }
  }



  handleRemoval(e) {
    e.preventDefault();
    console.log(this.currentObjectID);
    this.taskobjectID = this.currentObjectID;
    this.editTaskButtonDelete();
    this.editTaskButtonCancel();
    setTimeout(() => {
      this.getData()
    }, 400)
  }

  editTaskButtonDelete = async () => {
    // e.preventDefault();
    //const { email ,phone, skills, password, cpassword } = user;//Obj destructuring
    const res = await fetch("https://spaces-server.herokuapp.com/removeTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // adminEmailID: this.AdminId,
        // spaceID: this.spaceID,
        taskDocID: this.taskobjectID,
        token: localStorage.getItem('token')
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      //document.getElementById('name_error').textContent = "Fill out name"
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      // window.alert(" Registration Successful");
      console.log(this.emailID);
      console.log(" Task Deleted Successfuly");
    }
  }

  editTaskButtonCancel = () => {
    this.setState({ displayEditTask: { display: 'none' } });
  }

  cancelAddTaskPopUpClick = () => {
    this.setState({ displayAddTask: { display: 'none' } });
  }
  //TIME CONVERSION (HRS TO HH:MM) :----->
  time_convert(num) {
    var hours = Math.trunc(num);
    var minutes = Math.trunc((num - hours) * 60);
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    return hours + ":" + minutes;
  }
  handleSubmit(e) {
    e.preventDefault();
    this.emailIDs = this.emails.current.value;
    this.taskName = this.name.current.value;
    this.tasktime = this.time.current.value;
    this.taskstatus = this.status.current.value;
    this.taskstartDate = this.startDate.current.value;
    this.taskendDate = this.endDate.current.value;
    this.addTaskButtonSubmit();
    this.cancelAddTaskPopUpClick();
    // setTimeout(() => {
    //   this.getData()
    // }, 400)
  }

  addTaskButtonSubmit = async () => {
    // e.preventDefault();
    //const { email ,phone, skills, password, cpassword } = user;//Obj destructuring
    const res = await fetch("https://spaces-server.herokuapp.com/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        memberEmailIDs: this.emailIDs,
        taskName: this.taskName,
        time: this.tasktime,
        status: this.taskstatus,
        startDate: this.taskstartDate,
        endDate: this.taskendDate,
        token: localStorage.getItem('token')
      })
    });
    const data = await res.json();
    console.log(data);
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log(" Task added Successfuly");
      this.getData();
    }
  }


  render() {
    let sidebar = <Sidebar />;
    let addTaskButton = <div />
    if (localStorage.getItem('token')) {
      var token = jwt.decode(localStorage.getItem('token'))
      console.log("Decoded Token: ", token)
      console.log(Date.now())
      if (Date.now() <= (token.exp * 1000)) {
        console.log("Token Not Expired")
        if (token.admin) {
          sidebar = <Sidebar />
          addTaskButton = <div class="tasks-button-row">
            <button class="purple-button" onClick={this.addTaskButtonClick}>Add New Task</button>
          </div>;
          this.assigned = { display: 'flex' };
          this.deleteButton = { display: 'flex' };
          // this.setState({ assigned: { display: 'block' } });
        }
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

    // let sidebar;
    // if (localStorage.getItem('adminUsername')) {
    //   sidebar = <Sidebar />
    // } else {
    //   sidebar = <SidebarDeveloper />
    // }
    if (this.state.loading) {
      return (<div class="load_data">
        <div class="loader"></div>
        <br />
        Loading
      </div>);
    } else {
      return (
        <Fragment>
          <Navbar />
          <div class="wrapper">
            {sidebar}

            <div class="main_content">

              <div class="header">
                <h1>Tasks</h1>
                <br />
                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
              </div>

              <div class="info">
                <br />

                <div class="tab">
                  <button class={this.state.Inprogress_TabLink} onClick={() => {
                    this.setState({ Inprogress_display: { display: 'flex' } });
                    this.setState({ Upcoming_display: { display: 'none' } });
                    this.setState({ Completed_display: { display: 'none' } });
                    this.setState({ Inprogress_TabLink: 'tablinks active' });
                    this.setState({ Upcoming_TabLink: 'tablinks' });
                    this.setState({ Completed_TabLink: 'tablinks' });
                  }}>In progress</button>
                  <button class={this.state.Upcoming_TabLink} onClick={() => {
                    this.setState({ Inprogress_display: { display: 'none' } });
                    this.setState({ Upcoming_display: { display: 'flex' } });
                    this.setState({ Completed_display: { display: 'none' } });
                    this.setState({ Inprogress_TabLink: 'tablinks' });
                    this.setState({ Upcoming_TabLink: 'tablinks active' });
                    this.setState({ Completed_TabLink: 'tablinks' });
                  }}>Up coming</button>
                  <button class={this.state.Completed_TabLink} onClick={() => {
                    this.setState({ Inprogress_display: { display: 'none' } });
                    this.setState({ Upcoming_display: { display: 'none' } });
                    this.setState({ Completed_display: { display: 'flex' } });
                    this.setState({ Inprogress_TabLink: 'tablinks' });
                    this.setState({ Upcoming_TabLink: 'tablinks' });
                    this.setState({ Completed_TabLink: 'tablinks active' });
                  }}>Completed</button>
                </div>
                <div class="task-outer-box-row" id="in_progress" style={this.state.Inprogress_display}>
                  <div class="tasks-outer-box">
                    <div class="tasks-row">

                      {this.state.inProgressTasks.map((inProgressTask, index) => (
                        <div class="task-card">
                          <div class="task-card-row1">
                            <p>{inProgressTask.name}</p>
                            <button type="task_edit_button" ><i class="fas fa-pencil-alt" onClick={() => {
                              this.setState({ displayEditTask: { display: 'block' } });
                              this.currentObjectID = inProgressTask._id;
                              console.log("click: ", this.currentObjectID)
                              this.Editname.current.value = inProgressTask.name;
                              this.Editemails.current.value = inProgressTask.assignedTo.join(";");
                              this.Edittime.current.value = inProgressTask.time;
                              this.Editstatus.current.value = inProgressTask.status;
                              this.EditstartDate.current.value = new Date(inProgressTask.startDate).toISOString().split('T')[0];
                              this.EditendDate.current.value = new Date(inProgressTask.endDate).toISOString().split('T')[0];

                            }}></i></button>
                          </div>
                          <div class="task-card-row1point5">
                            <p>Time:- <span>{inProgressTask.time} Hrs</span></p>
                          </div>
                          <div class="task-card-row2">

                            <br></br>
                            <p>Assigned to:-{inProgressTask.assignedTo.map((item) =>
                              <p key={item}><span>{item}</span></p>
                            )}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div class="task-outer-box-row" id="up_coming" style={this.state.Upcoming_display}>
                  <div class="tasks-outer-box">
                    <div class="tasks-row">

                      {this.state.upcomingTasks.map((upcomingTask, index) => (
                        <div class="task-card">
                          <div class="task-card-row1">
                            <p>{upcomingTask.name}</p>
                            <button type="task_edit_button" ><i class="fas fa-pencil-alt" onClick={() => {
                              this.setState({ displayEditTask: { display: 'block' } });
                              this.currentObjectID = upcomingTask._id;
                              console.log("click: ", this.currentObjectID)
                              this.Editname.current.value = upcomingTask.name;
                              this.Editemails.current.value = upcomingTask.assignedTo.join(";");
                              this.Edittime.current.value = upcomingTask.time;
                              this.Editstatus.current.value = upcomingTask.status;
                              this.EditstartDate.current.value = new Date(upcomingTask.startDate).toISOString().split('T')[0];
                              this.EditendDate.current.value = new Date(upcomingTask.endDate).toISOString().split('T')[0];

                            }}></i></button>
                          </div>

                          <div class="task-card-row1point5">
                            <p>Time:- <span>{upcomingTask.time} Hrs</span></p>
                          </div>
                          <div class="task-card-row2">

                            <br></br>
                            <p>Assigned to:-{upcomingTask.assignedTo.map((item) =>
                              <p key={item}><span>{item}</span></p>
                            )}</p>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>

                </div>

                <div class="task-outer-box-row" id="completed" style={this.state.Completed_display}>
                  <div class="tasks-outer-box">
                    <div class="tasks-row">

                      {this.state.completedTasks.map((completedTask, index) => (
                        <div class="task-card">
                          <div class="task-card-row1">
                            <p>{completedTask.name}</p>

                            <button type="task_edit_button" ><i class="fas fa-pencil-alt" onClick={() => {
                              this.setState({ displayEditTask: { display: 'block' } });
                              this.currentObjectID = completedTask._id;
                              console.log("click: ", this.currentObjectID)
                              this.Editname.current.value = completedTask.name;
                              this.Editemails.current.value = completedTask.assignedTo.join(";");
                              this.Edittime.current.value = completedTask.time;
                              this.Editstatus.current.value = completedTask.status;
                              this.EditstartDate.current.value = new Date(completedTask.startDate).toISOString().split('T')[0];
                              this.EditendDate.current.value = new Date(completedTask.endDate).toISOString().split('T')[0];

                            }}></i></button>
                          </div>

                          <div class="task-card-row1point5">
                            <p>Time:- <span>{completedTask.time} Hrs</span></p>
                          </div>

                          <div class="task-card-row2">

                            <br></br>
                            <p>Assigned to:-{completedTask.assignedTo.map((item) =>
                              <p key={item}><span>{item}</span></p>
                            )}</p>
                          </div>
                        </div>
                      ))}

                    </div>

                  </div>

                </div>

                {/* <div class="tasks-button-row">
                  <button class="purple-button" onClick={this.addTaskButtonClick}>Add New Task</button>
                </div> */}
                {addTaskButton}



                <br />
                <br />

                <div class="time-spent-title">
                  <h1>Total time spent till now</h1>
                </div>


                <div class="time-spent-outer-box-row">

                  <div class="time-spent-outer-box">

                    <h1>{this.time_convert(this.state.totalTimeSpent) + " "}hrs</h1>

                  </div>



                </div>




                <div class="common-dialog-box-background" id="add-task-dialog-box" style={this.state.displayAddTask}>

                  <div class="common-dialog-box">


                    <div class="common-dialog-box-title">
                      <h1>Add a new task</h1>
                    </div>


                    <form action="#">

                      <div class="common-dialog-box-details">

                        <div class="common-dialog-box-input-box">
                          <span>Task Name</span>
                          <input type="text" ref={this.name} />
                        </div>

                        <div class="common-dialog-box-input-box" >
                          <span>Assigned to <br />(Email address separated by ';')</span>
                          <input type="text" ref={this.emails} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Time alloted (in hrs)</span>
                          <input type="text" ref={this.time} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Change status</span>

                          <select name="status" id="dropdown-status" ref={this.status}>
                            <option value="In Progress">In Progress</option>
                            <option value="Upcoming">Up Coming</option>
                            <option value="Completed">Completed</option>

                          </select>
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Start date</span>
                          <input type="date" placeholder="yyyy-mm-dd" ref={this.startDate} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>End date</span>
                          <input type="date" placeholder="yyyy-mm-dd" ref={this.endDate} />
                        </div>

                      </div>

                    </form>



                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={this.handleSubmit} >Add new task</button>

                      <button class="common-dialog-box-cancel-button" onClick={this.cancelAddTaskPopUpClick}>Cancel</button>


                    </div>

                  </div>
                </div>


                {/*  UPDATE-REMOVE TASK */}
                <div class="common-dialog-box-background" id="edit-task-dialog-box" style={this.state.displayEditTask}>

                  <div class="common-dialog-box">

                    <div class="common-dialog-box-title">
                      <h1>Edit task</h1>
                    </div>


                    <form action="#">
                      <div class="common-dialog-box-details">

                        <div class="common-dialog-box-input-box">
                          <span>Task Name</span>
                          <input type="text" ref={this.Editname} />
                        </div>

                        <div class="common-dialog-box-input-box" style={this.assigned}>
                          <span>Assigned to <br />(Email address separated by ';')</span>
                          <input type="text" ref={this.Editemails} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Time alloted (in hrs)</span>
                          <input type="text" ref={this.Edittime} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Add status</span>

                          <select name="status" id="dropdown-status" ref={this.Editstatus}>
                            <option value="In Progress">In Progress</option>
                            <option value="Upcoming">Up Coming</option>
                            <option value="Completed">Completed</option>

                          </select>
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Start date</span>
                          <input type="date"
                            placeholder="yyyy-mm-dd"
                            //value={this.EditstartDate}
                            ref={this.EditstartDate} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>End date</span>
                          <input type="date" placeholder="yyyy-mm-dd" ref={this.EditendDate} />
                        </div>

                      </div>


                    </form>

                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={this.handleEdit}>Update task</button>

                      <button class="common-dialog-box-cancel-button" style={this.deleteButton} onClick={this.handleRemoval}>Delete task</button>

                      <button class="common-dialog-box-cancel-button" onClick={this.editTaskButtonCancel}>Cancel</button>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </Fragment >
      );

    }

  }
}

export default TasksPage