import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');
class ResourcesPage extends React.Component {
  state = {
    loading: true,
    project: null,
    Resources: null,
    resources: [],
    addResourceDisplay: { display: 'none' },
    deleteResourceDisplay: { display: 'none' }
  };

  constructor(props) {
    super(props);
    // create a ref to store the DOM element
    this.handleNew = this.handleNew.bind(this);
    this.ResourceName = React.createRef();
    this.ResourceDescription = React.createRef();
    this.ResourceLink = React.createRef();
    this.handleRemoval = this.handleRemoval.bind(this);
  }

  token = localStorage.getItem("token");
  //projectID = localStorage.getItem("projectID");
  // ManagerId = ""
  // emailDomain = ""
  Name = ""
  description = ""
  link = ""
  objectID = ""


  handleNew(e) {
    e.preventDefault();
    this.Name = this.ResourceName.current.value;
    this.description = this.ResourceDescription.current.value;
    this.link = this.ResourceLink.current.value;
    // this.ManagerId = localStorage.getItem("managerUsername");
    // this.emailDomain = this.ManagerId.split("@")[1];
    this.AddNewResource();
    this.setState({ addResourceDisplay: { display: "none" } });
    setTimeout(() => {
      this.getData()
    }, 400)
    this.ResourceName.current.value = "";
    this.ResourceDescription.current.value = "";
    this.ResourceLink.current.value = "";
  }

  AddNewResource = async () => {
    const res = await fetch("https://spaces-server.herokuapp.com/addResource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        name: this.Name,
        description: this.description,
        link: this.link,
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log("Resource added Successfuly");
    }

  }



  handleRemoval(e) {
    e.preventDefault();
    this.removeResource();
    setTimeout(() => {
      this.getData()
    }, 400)
    this.setState({ deleteResourceDisplay: { display: "none" } })
  }

  removeResource = async () => {
    const res = await fetch("https://spaces-server.herokuapp.com/removeResource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        resourceDocID: this.ObjectID,
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else //if (res.status === 201) 
    {
      console.log(this.emailID);
      console.log("Resource Removed Successfuly");
    }
  }




  async getData() {
    const getSpaceMilestonesURL = "https://spaces-server.herokuapp.com/viewSpaceResources/" + `${this.token}`;
    axios.get(`${getSpaceMilestonesURL}`).then((res) => {
      var resources = []
      for (var i = 0; i < res.data.length; i++) {
        resources.push(res.data[i]);
      }
      console.log(res);
      console.log("loaded");
      this.setState({ Resources: res.data, loading: false });
      this.setState({ resources: resources });
    }).catch(err => {
      console.log(err);
    })
  }


  async componentWillMount() {
    const getSpaceDataURL = "https://spaces-server.herokuapp.com/overview/" + `${this.token}`;
    axios.get(`${getSpaceDataURL}`).then((res) => {
      this.setState({ project: res.data });
    }).catch(err => {
      console.log(err);
    })
    this.getData();
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
    if (this.state.loading) {
      return (
        <div class="load_data">
          <div class="loader"></div>
          <br />
          Loading
        </div>
      );
    } else {
      return (
        <Fragment>
          <Navbar />
          <div class="wrapper">
            {sidebar}

            <div class="main_content">

              <div class="header">
                <h1>Resources</h1>
                <br />
                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
              </div>

              <div class="info">
                <br />
                <br />



                <div class="resources-table">

                  <table class="content-table">
                    <thead>
                      <tr>
                        <th>Serial No.</th>
                        <th>Resource name</th>
                        <th>Link</th>
                        <th>Description</th>
                        {token.admin ? (<th>Delete</th>) : (null)}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.resources.map((Resource, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{Resource.name}</td>
                          <td><a href={Resource.link.includes("http") ? Resource.link : String("//") + Resource.link} target="_blank" rel="noreferrer">{Resource.link} </a></td>
                          <td>{Resource.description}</td>

                          {token.admin ?
                            (<td styles="text-align:center"><button class="delete_table_row_button" onClick={() => {
                              this.name = Resource.name;
                              this.setState({ deleteResourceDisplay: { display: 'block' } });
                              // console.log(this.state.deleteDeliverableDisplay)
                              this.ObjectID = Resource._id;
                              console.log("click: ", this.ObjectID)
                            }
                            }><i class="far fa-trash-alt"></i></button></td>) : (null)}

                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

                {token.admin ? (
                  <div class="cost-buttons-row">
                    <button class="add-expense-button" onClick={() => {
                      this.setState({ addResourceDisplay: { display: 'block' } })
                      console.log("addup")
                    }} > Add New Resource</button>

                  </div>
                ) : (null)}


                <div class="common-dialog-box-background" id="add-resource-dialog-box" style={this.state.addResourceDisplay}>

                  <div class="common-dialog-box">

                    <div class="common-dialog-box-title">
                      <h1>Add a new resource</h1>
                    </div>


                    <form action="#">

                      <div class="common-dialog-box-details">

                        <div class="common-dialog-box-input-box">
                          <span>Resource Name</span>
                          <input type="text" ref={this.ResourceName} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Resource link</span>
                          <input type="text" ref={this.ResourceLink} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Resource description</span>
                          <input type="text" ref={this.ResourceDescription} />
                        </div>

                      </div>

                    </form>



                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={
                        this.handleNew
                      }
                      >Add Resource</button>

                      <button class="common-dialog-box-cancel-button" onClick={() => {
                        this.setState({ addResourceDisplay: { display: 'none' } })
                        // console.log("addup")
                      }}>Cancel</button>


                    </div>

                  </div>
                </div>




                <div class="common-dialog-box-background" id="remove-resource-dialog-box" style={this.state.deleteResourceDisplay}>

                  <div class="common-dialog-box">

                    <div class="common-dialog-box-title">
                      <h1>Remove a Resource</h1>
                    </div>
                    {/* <form action="#">
                      <div class="common-dialog-box-details">
                         <div class="common-dialog-box-input-box">
                          <span><b>Serial No. </b>(of resource to be deleted)</span>
                          <input type="text" />
                        </div> 

                      </div>

                    </form> */}


                    <br />
                    <br />

                    <h2>{this.name}</h2>
                    <br />
                    <br />
                    <p>Are you sure you want delete this Resource?</p>
                    <br />
                    <br />

                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={this.handleRemoval}>Remove Resource</button>

                      <button class="common-dialog-box-cancel-button" onClick={() => {
                        this.setState({ deleteResourceDisplay: { display: 'none' } })
                        // console.log("addup")
                      }}>Cancel</button>

                    </div>

                  </div>
                </div>

              </div>

              <div class="resources-manager-page-blank-bottom-margin">

              </div>

            </div>
          </div>
        </Fragment >
      );

    }
  }
}

export default ResourcesPage