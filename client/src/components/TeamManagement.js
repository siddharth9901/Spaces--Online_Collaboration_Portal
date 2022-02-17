import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');

class TeamManagement extends React.Component {

  state = {
    loadingMembers: true,
    members: null,
    admin: null,
    loadingAdmin: true,
    displayAddMmebers: { display: 'none' },
    displayRemoveMmebers: { display: 'none' },
  };

  constructor(props) {
    super(props);
    // create a ref to store the DOM element
    this.newMemberEmailID = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeMemberEmailID = React.createRef();
    this.handleRemoval = this.handleRemoval.bind(this);
  }

  token = localStorage.getItem('token')
  // emailID = ""
  // spaceID = ""

  //ADD MEMBER FORM SUBMIT
  handleSubmit(e) {
    e.preventDefault();
    this.emailID = this.newMemberEmailID.current.value;
    // this.spaceID = localStorage.getItem('spaceID');
    this.PostData();
    this.onAddMemberCancel();
    // setTimeout(() => {
    //   this.componentDidMount();
    //   console.log(this.state.members);
    // }, 400)
  }

  //REMOVE MEMBER FORM SUBMIT
  handleRemoval(e) {
    e.preventDefault();
    this.emailID = this.removeMemberEmailID.current.value;
    //this.spaceID = localStorage.getItem('spaceID');
    this.PostRemovalData();
    this.onRemoveMemberCancel();
    // setTimeout(() => {     // NOW CALLING LOAD DATA IN POST REMOVAL DATA MEMBER REMOVED CONDITION
    //   this.componentDidMount();
    //   console.log(this.state.members);
    // }, 400)
  }

  //TO SHOW THE ADD MEMBER FORM
  onAddMemberClick = () => {
    // this.setState({dataToBeUpdated: true});
    this.setState({ displayAddMmebers: { display: 'block' } });
  }

  //TO DISMISS THE ADD MEMBER FORM
  onAddMemberCancel = () => {
    // this.setState({dataToBeUpdated: false});
    this.setState({ displayAddMmebers: { display: 'none' } });
    this.newMemberEmailID.current.value = null;
    //this.componentDidMount();
  }

  //TO ADD MEMBER POST DATA:--->
  PostData = async () => {//(e)
    // e.preventDefault();
    //const { email ,phone, skills, password, cpassword } = user;//Obj destructuring
    const res = await fetch("https://spaces-server.herokuapp.com/addMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        memberEmailID: this.emailID, token: this.token
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
      console.log(" Registration Successful");
      this.getData()
      //this.setState({dataUpdated: true});
      //history.push("/");
    }
    //  this.setState({dataToBeUpdated: false});
  }

  //TO SHOW THE REMOVE MEMBER FORM
  onRemoveMemberClick = () => {
    this.setState({ displayRemoveMmebers: { display: 'block' } });
  }

  //TO DISMISS THE REMOVE MEMBER FORM
  onRemoveMemberCancel = () => {
    this.setState({ displayRemoveMmebers: { display: 'none' } });
    this.removeMemberEmailID.current.value = null;
  }

  //TO REMOVE MEMBER POST DATA
  PostRemovalData = async () => {//(e)
    // e.preventDefault();
    //const { email ,phone, skills, password, cpassword } = user;//Obj destructuring
    const res = await fetch("https://spaces-server.herokuapp.com/removeMember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        memberEmailID: this.emailID, token: this.token
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      //document.getElementById('name_error').textContent = "Fill out name"
      window.alert("Invalid Email-id");
      console.log(data);
    } else if (res.status === 201) {
      // window.alert(" Member Removed");
      console.log(" Member removed");
      this.getData()
      //history.push("/");
    }
  }


  //GET DATA FOR MANAGER
  async getData() {
    var email = ""
    if (localStorage.getItem('adminUsername')) {
      email = localStorage.getItem('adminUsername');
    }
    else {
      email = localStorage.getItem('username');
    }
    const spaceID = localStorage.getItem('spaceID');
    const getMembersDataURL = "https://spaces-server.herokuapp.com/viewMembers/" + `${this.token}`;
    axios.get(`${getMembersDataURL}`).then((res) => {
      this.setState({ members: res.data, loadingMembers: false });
      // console.log(this.state.space.startDate);
      // console.log(typeof(this.state.space.startDate));
      // console.log(ft)
      //setSpaceData(res.data);
      //const animals = [{ id: 1, animal: "Dog" }];
      console.log(this.state.members);
    }).catch(err => {
      console.log(err);
    })

    //GETING MANAGER DATA:--->
    const getAdminDataURL = "https://spaces-server.herokuapp.com/viewAdmin/" + `${this.token}`;
    axios.get(`${getAdminDataURL}`).then((res) => {
      this.setState({ admin: res.data, loadingAdmin: false });
      // console.log(this.state.space.startDate);
      // console.log(typeof(this.state.space.startDate));
      // console.log(ft)
      //setSpaceData(res.data);
      //const animals = [{ id: 1, animal: "Dog" }];
      console.log(this.state.admin);
    }).catch(err => {
      console.log(err);
    })
  }

  async componentDidMount() {
    console.log("called componentDidMount");
    this.getData();
    // this.setState({dataToBeUpdated: false});
  }


  render() {
    // const { showAdd } = this.DispState;

    // const style = showAdd ? {display: 'block'} : {};

    //window.alert("YO MANAGER")
    let buttons = <div ></div>;
    let sidebar;
    if (localStorage.getItem('token')) {
      var token = jwt.decode(localStorage.getItem('token'));
      sidebar = <Sidebar />
      if (token.admin) {
        buttons = <div class="member-buttons-row">
          <button class="add-member-button" onClick={this.onAddMemberClick}> Add New Member </button>

          <button class="remove-member-button" onClick={this.onRemoveMemberClick}>Remove a member</button>
        </div>
      }
      if (this.state.loadingMembers || this.state.loadingAdmin) {
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
                  <h1>Team Members</h1>
                  <br />
                  <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                </div>

                <div class="info">
                  <br />

                  <div class="admins-title">
                    <h1>Admin details</h1>
                  </div>

                  <div class="admin-cards-row">

                    <div class="admin-card">

                      <div class="admin-card-row1">
                        <h3>Name:</h3>
                        <p>{this.state.admin.name}</p>
                      </div>

                      <div class="admin-card-row2">
                        <h3>Contact:</h3>
                        <p>{this.state.admin.phone}</p>
                      </div>

                      <div class="admin-card-row3">
                        <h3>Email:</h3>
                        <p>{this.state.admin.email}</p>
                      </div>
                    </div>

                  </div>

                  <br />
                  <br />

                  <div class="team-members-title">
                    <h1>Team member details</h1>
                  </div>

                  <div class="team-member-cards-row">

                    {/* CARD STARTS */}
                    {this.state.members.map((user, index) => (
                      <div key={index} class="team-member-card">

                        <div class="team-member-card-row1">
                          <h3>Name:</h3>
                          <p>{user.name}</p>
                        </div>

                        <div class="team-member-card-row2">
                          <h3>Contact:</h3>
                          <p>{user.phone}</p>
                        </div>

                        <div class="team-member-card-row3">
                          <h3>Email:</h3>
                          <p>{user.email}</p>
                        </div>

                        <div class="team-member-card-row4">
                          <h3>Skills:</h3>
                          <p>{user.skills}</p>
                        </div>

                      </div>
                    ))}
                    {/* CARD ENDS */}

                    {/* <div class="team-member-card">
  
            <div class="team-member-card-row1">
              <h3>Name:</h3>
              <p>Member2</p>
            </div>
  
            <div class="team-member-card-row2">
              <h3>Contact:</h3>
              <p>3456789012</p>
            </div>
  
            <div class="team-member-card-row3">
              <h3>Email:</h3>
              <p>member2@gmail.com</p>
            </div>
  
            <div class="team-member-card-row4">
              <h3>Skills:</h3>
              <p>UI/UX, HTML, CSS, FLUTTER</p>
            </div>
  
      </div> */}


                  </div>

                  {buttons}
                  {/* <div class="member-buttons-row">
                  <button class="add-member-button" onClick={this.onAddMemberClick}> Add New Member </button>

                  <button class="remove-member-button" onClick={this.onRemoveMemberClick}>Remove a member</button>
                </div> */}


                  <div class="common-dialog-box-background" id="add-member-dialog-box" style={this.state.displayAddMmebers} >

                    <div class="common-dialog-box">

                      <div class="common-dialog-box-title">
                        <h1>Add a new member</h1>
                      </div>


                      <form>

                        <div class="common-dialog-box-details">

                          {/* <div class="common-dialog-box-input-box">
                          <span>Name</span>
                          <input type="text" />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Contact Number</span>
                          <input type="text" />
                        </div> */}

                          <div class="common-dialog-box-input-box">
                            <span>Email address</span>
                            <input type="email" name="email" id="email" ref={this.newMemberEmailID}

                              placeholder="Enter email-id" />
                          </div>

                        </div>

                      </form>

                      <div class="common-dialog-box-buttons-row">

                        {/* <button class = "common-dialog-box-confirm-button"  >Add member</button> */}
                        <button class="common-dialog-box-confirm-button" onClick={this.handleSubmit}>Add Member</button>
                        <button class="common-dialog-box-cancel-button" onClick={this.onAddMemberCancel}>Cancel</button>
                        {/* <button class = "common-dialog-box-cancel-button" onClick={this.onAddMemberCancel}>Cancel</button> */}


                      </div>
                    </div>
                  </div>




                  <div class="common-dialog-box-background" id="remove-member-dialog-box" style={this.state.displayRemoveMmebers}>

                    <div class="common-dialog-box">

                      <div class="common-dialog-box-title">
                        <h1>Remove a member</h1>
                      </div>


                      <form action="#">

                        <div class="common-dialog-box-details">


                          <div class="common-dialog-box-input-box">
                            <span>Email address</span>
                            <input type="email" name="email" id="email" ref={this.removeMemberEmailID}

                              placeholder="Enter email-id" />
                          </div>

                        </div>

                      </form>

                      <div class="common-dialog-box-buttons-row">

                        <button class="common-dialog-box-confirm-button" onClick={this.handleRemoval}>Remove member</button>

                        <button class="common-dialog-box-cancel-button" onClick={this.onRemoveMemberCancel}>Cancel</button>


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
}

export default TeamManagement