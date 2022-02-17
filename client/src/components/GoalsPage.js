import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');

class GoalsPage extends React.Component {

  state = {
    loading: true,
    space: null,
    Goals: [],
    GoalsDisplay: { display: 'flex' },
    currentGoals: [],
    completedGoals: [],
    addGoalDisplay: { display: "none" },
    confirmGoalDisplay: { display: "none" },
    deleteGoalDisplay: { display: "none" },
  };

  constructor(props) {
    super(props)
    // create a ref to store the DOM element
    this.handleNewGoal = this.handleNewGoal.bind(this);
    this.GoalName = React.createRef();
    this.GoalDescription = React.createRef();
    this.GoalExpectedCompletionDate = React.createRef();
    this.currentObjectID = "";
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleRemoval = this.handleRemoval.bind(this);
  }



  async getData() {
    const token = localStorage.getItem('token');
    const getSpaceGoalsURL = "https://spaces-server.herokuapp.com/viewSpaceGoals/" + `${token}`;
    console.log("Getting Data");
    axios.get(`${getSpaceGoalsURL}`).then((res) => {
      //console.log(this.state.tasks);
      var currentGoals = []
      var completedGoals = []
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].status == "Completed" && res.data[i].type == "Goal") {
          completedGoals.push(res.data[i]);
        } else if (res.data[i].status == "Current" && res.data[i].type == "Goal") {
          currentGoals.push(res.data[i]);
        }
      }
      console.log(res);
      console.log("loaded");
      this.setState({ Goals: res.data, loading: false });
      this.setState({ currentGoals: currentGoals, completedGoals: completedGoals });
      // console.log(this.state.inProgressTasks);
    }).catch(err => {
      console.log(err);
    })
  }

  token = localStorage.getItem('token');
  dToken = jwt.decode(localStorage.getItem('token'));

  //spaceID = jwt.token.decode.spaceID;
  AdminId = ""
  emailDomain = ""
  Name = ""
  status = ""
  completion = ""
  description = ""
  type = ""
  objectID = ""

  handleNewGoal(d) {
    d.preventDefault();
    this.Name = this.GoalName.current.value;
    this.status = "Current";
    this.type = "Goal";
    this.AdminId = this.dToken.username;
    this.completion = this.GoalExpectedCompletionDate.current.value;
    this.description = this.GoalDescription.current.value;
    this.AddNewGoal();
    this.setState({ addGoalDisplay: { display: "none" } });
    setTimeout(() => {
      this.getData()
    }, 400)
    this.GoalName.current.value = ""
    this.GoalDescription.current.value = ""
    this.GoalExpectedCompletionDate.current.value = ""
  }

  AddNewGoal = async () => {
    console.log("add goal: ", this.token);
    const res = await fetch("https://spaces-server.herokuapp.com/addGoal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        name: this.Name,
        type: this.type,
        status: this.status,
        expectedCompletionDate: this.completion,
        description: this.description
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log("Goal added Successfuly");
    }

  }


  handleConfirm(e) {
    this.AdminId = this.dToken.username;
    e.preventDefault();
    this.confirmGoal();
    setTimeout(() => {
      this.getData()
    }, 400)
    this.setState({ confirmGoalDisplay: { display: "none" } })
  }

  confirmGoal = async () => {
    const res = await fetch("https://spaces-server.herokuapp.com/updateGoal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        goalDocID: this.ObjectID,
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log("Goal added Successfuly");
    }
  }



  handleRemoval(e) {
    this.AdminId = this.dToken.username;
    e.preventDefault();
    this.removeGoal();
    setTimeout(() => {
      this.getData()
    }, 400)
    this.setState({ deleteDeliverableDisplay: { display: "none" } })
    this.setState({ deleteGoalDisplay: { display: "none" } })
  }

  removeGoal = async () => {
    const res = await fetch("https://spaces-server.herokuapp.com/removeGoal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        goalDocID: this.ObjectID,
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log("Goal added Successfuly");
    }
  }


  async componentDidMount() {
    const email = localStorage.getItem('adminUsername');
    const spaceID = localStorage.getItem('spaceID');
    const getSpaceDataURL = "https://spaces-server.herokuapp.com/overview/" + `${localStorage.getItem('token')}`;
    this.getData();
    axios.get(`${getSpaceDataURL}`).then((res) => {
      this.setState({ space: res.data, loading: false });
      // console.log(this.state.space.startDate);
      // console.log(typeof(this.state.space.startDate));
      // console.log(ft)
      //setSpaceData(res.data);
      //console.log(space);
    }).catch(err => {
      console.log(err);
    })
  }
  // console.log('componentDidMount() lifecycle');
  //  fetch('https://spaces-server.herokuapp.com/overview').then(res=>res.json())
  //  .then(res2=>{
  //         console.log(res2);
  //  });
  // Trigger update
  // this.setState({ foo: !this.state.foo });
  //}

  render() {
    if (this.state.loading) {
      return (<div class="load_data">
        <div class="loader"></div>
        <br />
        Loading
      </div>);
    } else {
      if (this.dToken.admin) {
        return (
          <Fragment>
            <Navbar />
            <div class="wrapper">
              <Sidebar />
              <div class="main_content">

                <div class="header">
                  <h1>Goals</h1>
                  <br />
                  <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                </div>

                <div class="info">
                  <br />
                  <div class="goals-and-deliverables" id="goals-box" style={this.state.GoalsDisplay}>
                    <div class="in-progress-goals-table-title">
                      <h1>In progress goals</h1>
                    </div>
                    <div class="in-progress-goals-table">

                      <table class="content-table">
                        <thead>
                          <tr>
                            <th>Serial No.</th>
                            <th>Goal</th>
                            <th>Description</th>
                            <th>Expected date of completion</th>
                            <th>Mark as Complete</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>

                          {this.state.currentGoals.map((Goal, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{Goal.name}</td>
                              <td>{Goal.description}</td>
                              <td>{new Date(Goal.expectedCompletionDate).toDateString()}</td>
                              <td styles="text-align:center"><button class="mark_as_complete_button" onClick={() => {
                                this.name = Goal.name;
                                this.setState({ confirmGoalDisplay: { display: 'block' } });
                                this.ObjectID = Goal._id;
                                console.log("click: ", this.ObjectID)
                              }
                              }>
                                <i class="fas fa-check"></i></button></td>
                              <td styles="text-align:center"><button class="delete_table_row_button" onClick={() => {
                                this.name = Goal.name;
                                this.setState({ deleteGoalDisplay: { display: 'block' } });
                                console.log(this.state.deleteGoalDisplay)
                                this.ObjectID = Goal._id;
                                console.log("click: ", this.ObjectID)
                              }
                              }><i class="far fa-trash-alt"></i></button></td>
                            </tr>

                          ))}


                        </tbody>
                      </table>

                    </div>

                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={() => {
                        this.setState({ addGoalDisplay: { display: "block" } })
                      }} >Add Goal</button>



                    </div>

                    <br />
                    <br />


                    <div class="completed-goals-table-title">
                      <h1>Completed goals</h1>
                    </div>




                    <div class="completed-goals-table">
                      <table class="content-table">
                        <thead>
                          <tr>
                            <th>Serial No.</th>
                            <th>Goal</th>
                            <th>Description</th>
                            <th>Actual date of completion</th>
                          </tr>
                        </thead>
                        <tbody>

                          {this.state.completedGoals.map((Goal, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{Goal.name}</td>
                              <td>{Goal.description}</td>
                              <td>{new Date(Goal.expectedCompletionDate).toDateString()}</td>
                            </tr>

                          ))}
                        </tbody>
                      </table>
                    </div>



                    <div class="common-dialog-box-background" id="task-completed-confirmation-dialog-box" style={this.state.confirmGoalDisplay}>

                      <div class="common-dialog-box">

                        <div class="common-dialog-box-title">
                          <h1>Confirmation</h1>
                        </div>


                        <br />
                        <br />

                        <h2>{this.name}</h2>

                        <p>Are you sure you want to mark this Goal as completed?</p>
                        <br />
                        <br />


                        <div class="common-dialog-box-buttons-row">

                          <button class="common-dialog-box-confirm-button" onClick={this.handleConfirm} >Yes</button>

                          <button class="common-dialog-box-cancel-button"
                            onClick={() => { this.setState({ confirmGoalDisplay: { display: "none" } }) }}
                          >No</button>


                        </div>
                        <br />
                        <br />

                      </div>
                    </div>



                    <div class="common-dialog-box-background" id="task-completed-confirmation-dialog-box" style={this.state.confirmDeliverableDisplay}>

                      <div class="common-dialog-box">

                        <div class="common-dialog-box-title">
                          <h1>Confirmation</h1>
                        </div>


                        <br />
                        <br />

                        <h2>{this.name}</h2>

                        <p>Are you sure you want to mark this Deliverable as completed?</p>
                        <br />
                        <br />


                        <div class="common-dialog-box-buttons-row">

                          <button class="common-dialog-box-confirm-button" onClick={this.handleConfirm} >Yes</button>

                          <button class="common-dialog-box-cancel-button" onClick={() => { this.setState({ confirmDeliverableDisplay: { display: "none" } }) }}>No</button>


                        </div>
                        <br />
                        <br />

                      </div>
                    </div>



                    <div class="common-dialog-box-background" id="add-goal-dialog-box" style={this.state.addGoalDisplay}>

                      <div class="common-dialog-box">

                        <div class="common-dialog-box-title">
                          <h1>Add a new goal</h1>
                        </div>


                        <form action="#">

                          <div class="common-dialog-box-details">

                            <div class="common-dialog-box-input-box">
                              <span>Goal name</span>
                              <input type="text" ref={this.GoalName} />
                            </div>

                            <div class="common-dialog-box-input-box">
                              <span>Expected completion date</span>
                              <input type="date" placeholder="yyyy-mm-dd" ref={this.GoalExpectedCompletionDate} />
                            </div>

                            <div class="common-dialog-box-input-box">
                              <span>Goal description</span>
                              <input type="text" ref={this.GoalDescription} />
                            </div>

                          </div>

                        </form>



                        <div class="common-dialog-box-buttons-row">

                          <button class="common-dialog-box-confirm-button"
                            onClick={
                              this.handleNewGoal
                            }
                          >Add Goal</button>

                          <button class="common-dialog-box-cancel-button" onClick={() => {
                            this.setState({ addGoalDisplay: { display: "none" } })
                          }}>Cancel</button>


                        </div>

                      </div>
                    </div>


                    <div class="common-dialog-box-background" id="add-goal-dialog-box" style={this.state.addDeliverableDisplay}>

                      <div class="common-dialog-box">

                        <div class="common-dialog-box-title">
                          <h1>Add a new deliverable</h1>
                        </div>


                        <form action="#">

                          <div class="common-dialog-box-details">

                            <div class="common-dialog-box-input-box">
                              <span>Deliverable name</span>
                              <input type="text" ref={this.DeliverableName} />
                            </div>

                            <div class="common-dialog-box-input-box">
                              <span>Expected completion date</span>
                              <input type="date" placeholder="yyyy-mm-dd" ref={this.DeliverableExpectedCompletionDate} />
                            </div>

                            <div class="common-dialog-box-input-box">
                              <span>Deliverable description</span>
                              <input type="text" ref={this.DeliverableDescription} />
                            </div>
                          </div>

                        </form>



                        <div class="common-dialog-box-buttons-row">

                          <button class="common-dialog-box-confirm-button" onClick={this.handleNewDeliverable}>Add Deliverable</button>

                          <button class="common-dialog-box-cancel-button" onClick={() => {
                            this.setState({ addDeliverableDisplay: { display: "none" } })
                          }}>Cancel</button>


                        </div>

                      </div>
                    </div>



                  </div>

                  <div class="common-dialog-box-background" id="delete-goal-dialog-box" style={this.state.deleteGoalDisplay}>

                    <div class="common-dialog-box">

                      <div class="common-dialog-box-title">
                        <h1>Delete goal</h1>
                      </div>


                      <br />

                      <h3>Goal name: {this.name}</h3>

                      <br />

                      <p>Are you sure you want delete this Goal?</p>

                      <br />
                      <br />


                      <div class="common-dialog-box-buttons-row">

                        <button class="common-dialog-box-confirm-button" onClick={this.handleRemoval} >Delete Goal</button>


                        <button class="common-dialog-box-cancel-button" onClick={() => {
                          this.setState({ deleteGoalDisplay: { display: "none" } })
                        }}>Cancel</button>


                      </div>

                    </div>
                  </div>




                </div>
              </div>
            </div>
          </Fragment >
        );

      } else {
        return (

          <Fragment>
            <Navbar />
            <div class="wrapper">
              <Sidebar />
              <div class="main_content">

                <div class="header">
                  <h1>Goals and Deliverables</h1>
                  <br />
                  <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                </div>

                <div class="info">
                  <br />

                  <div class="tab">
                    <button class={this.state.GoalsActive} onClick={() => {
                      this.setState({ GoalsDisplay: { display: 'flex' } });
                      this.setState({ GoalsActive: "tablinks active" });
                    }} id="defaultOpen">Goals</button>

                  </div>


                  <div class="goals-and-deliverables" id="goals-box" style={this.state.GoalsDisplay}>
                    <div class="in-progress-goals-table-title">
                      <h1>In progress goals</h1>
                    </div>


                    <div class="in-progress-goals-table">

                      <table class="content-table">
                        <thead>
                          <tr>
                            <th>Serial No.</th>
                            <th>Goal</th>
                            <th>Description</th>
                            <th>Expected date of completion</th>
                          </tr>
                        </thead>
                        <tbody>

                          {this.state.currentGoals.map((Goal, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{Goal.name}</td>
                              <td>{Goal.description}</td>
                              <td>{new Date(Goal.expectedCompletionDate).toDateString()}</td>
                            </tr>

                          ))}


                        </tbody>
                      </table>

                    </div>

                    <br />
                    <div class="completed-goals-table-title">
                      <h1>Completed goals</h1>
                    </div>
                    <div class="completed-goals-table">
                      <table class="content-table">
                        <thead>
                          <tr>
                            <th>Serial No.</th>
                            <th>Goal</th>
                            <th>Description</th>
                            <th>Actual date of completion</th>
                          </tr>
                        </thead>
                        <tbody>

                          {this.state.completedGoals.map((Goal, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{Goal.name}</td>
                              <td>{Goal.description}</td>
                              <td>{new Date(Goal.expectedCompletionDate).toDateString()}</td>
                            </tr>

                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <br />
                <br />
              </div>
            </div>
          </Fragment >
        );
      }
    }
  }
}


export default GoalsPage