import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
// import Sidebar from './Sidebar';
import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');


// const loadData = () => {
//   const [spaceData, setSpaceData] = useState();
// };

class MainPage extends React.Component {
    state = {
        loading: true,
        user: null,
        confirmDisplay: { display: "none" }
    };

    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.name = React.createRef();
        //this.emailID = React.createRef();
        this.password = React.createRef();
        this.cpassword = React.createRef();
        this.skills = React.createRef();
        this.phone = React.createRef();
    }

    async getData() {

        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token')
            const getSpaceDataURL = "https://spaces-server.herokuapp.com/profileInfo/" + `${token}`;
            axios.get(`${getSpaceDataURL}`).then((res) => {
                console.log(res.data)
                this.setState({ user: res.data, loading: false });
                this.name.current.value = this.state.user.name;
                //this.emailID.current.value = this.state.user.email;
                this.skills.current.value = this.state.user.skills;
                this.phone.current.value = this.state.user.phone;
            }).catch(err => {
                console.log(err);
            })

            // if (localStorage.getItem('adminUsername')) {
            //   const email = localStorage.getItem('adminUsername');
            //   this.ProfileEmail = email;
            //   const getSpaceDataURL = "https://spaces-server.herokuapp.com/profileInfo/" + `${email}`;
            //   axios.get(`${getSpaceDataURL}`).then((res) => {
            //     console.log(res.data)
            //     this.setState({ user: res.data, loading: false });
            //     this.name.current.value = this.state.user.name;
            //     //this.emailID.current.value = this.state.user.email;
            //     this.skills.current.value = this.state.user.skills;
            //     this.phone.current.value = this.state.user.phone;
            //   }).catch(err => {
            //     console.log(err);
            //   })
            // }
            // if (localStorage.getItem('username')) {
            //   const email = localStorage.getItem('username');
            //   this.ProfileEmail = email;
            //   const getSpaceDataURL = "https://spaces-server.herokuapp.com/profileInfo/" + `${email}`;
            //   axios.get(`${getSpaceDataURL}`).then((res) => {
            //     console.log(res.data)
            //     this.setState({ user: res.data, loading: false });
            //     this.name.current.value = this.state.user.name;
            //     //this.emailID.current.value = this.state.user.email;
            //     this.skills.current.value = this.state.user.skills;
            //     this.phone.current.value = this.state.user.phone;
            //   }).catch(err => {
            //     console.log(err);
            //   })
            // }
        }
    }


    async componentWillMount() {
        this.getData()
    }

    // UserEmail = ""
    ProfileName = ""
    ProfilePassword = ""
    ProfileEmail = ""
    ProfilePhone = ""
    ProfileSkills = ""


    handleEdit(e) {
        e.preventDefault();
        // if (localStorage.getItem('adminUsername')) {
        //   this.UserEmail = localStorage.getItem('adminUsername');
        //   this.emailDomain = localStorage.getItem('adminUsername').split('@');
        // } else {
        //   this.UserEmail = localStorage.getItem('username');
        //   this.emailDomain = localStorage.getItem('username').split('@');
        // }
        this.ProfileName = this.name.current.value
        //this.ProfileEmail = this.emailID.current.value
        this.ProfilePhone = this.phone.current.value
        this.ProfileSkills = this.skills.current.value
        if (this.cpassword.current.value == this.password.current.value) {
            this.ProfilePassword = this.password.current.value;
            this.editProfile();
            setTimeout(() => {
                this.getData()
            }, 400)
            this.setState({ confirmDisplay: { display: "none" } })
        }
        else {
            window.alert("Error! Passwords do not match !!!")
        }
    }

    editProfile = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                name: this.ProfileName,
                phone: this.ProfilePhone,
                password: this.ProfilePassword,
                cpassword: this.cpassword.current.value,
                skills: this.ProfileSkills
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Invalid Request");
            console.log(data);
        } else if (res.status === 201) {
            console.log(this.emailID);
            console.log(" Profile Editted Successfuly");
        }
    }


    render() {
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
                    <div class="edit-profile-whole-page">

                        <div class="edit-profile-container">
                            <div class="edit-profile-title">Profile</div>
                            <h2>{this.ProfileEmail}</h2>

                            <form action="#">
                                <div class="edit-profile-user-details" style={{ padding: "20px 0px" }}>


                                    <div class="edit-profile-row-1">

                                        <div class="edit-profile-input-box">

                                            <label>Full name</label>
                                            <input type="text" ref={this.name} />
                                        </div>

                                        {/* <div class="edit-profile-input-box">
                      <span>Email address</span>
                      <input type="text" ref={this.emailID} />
                    </div> */}

                                        <div class="edit-profile-input-box">

                                            <label>Password</label>
                                            <input type="password" ref={this.password} />
                                        </div>

                                        <div class="edit-profile-input-box">

                                            <label>Confirm password</label>
                                            <input type="password" ref={this.cpassword} />

                                        </div>

                                        <div class="edit-profile-input-box" id="skills_textfield">

                                            <label>Skills</label>
                                            <input type="text" ref={this.skills} />
                                        </div>

                                        <div class="edit-profile-input-box">

                                            <label>Contact</label>
                                            <input type="text" ref={this.phone} />

                                        </div>

                                    </div>

                                    <div class="edit-profile-row-7">
                                        <div class="edit-profile-input-box">
                                            <input type="submit" value="Edit Profile" onClick={() => {
                                                this.setState({ confirmDisplay: { display: "block" } })
                                            }} class="create_space" />
                                        </div>

                                    </div>
                                </div>
                                {/* <div class="edit-profile-row-5">

                  <div class="edit-profile-input-box">
                    <span>Contact No.</span>
                    <input type="text" ref={this.phone} />
                  </div>

                </div> */}

                            </form>
                        </div>


                        <div class="common-dialog-box-background" id="confirm-edit-profile-dialog-box" style={this.state.confirmDisplay} >

                            <div class="confirm-dialog-box">


                                <p>Are you sure you want to edit profile?</p>

                                <div class="common-dialog-box-buttons-row">

                                    <button class="common-dialog-box-confirm-button" onClick={this.handleEdit}>Yes</button>

                                    <button class="common-dialog-box-cancel-button" onClick={() => {
                                        this.setState({ confirmDisplay: { display: "none" } })
                                    }}>No</button>


                                </div>


                            </div>







                            {


              /* <div class="common-dialog-box">


                <div class="common-dialog-box-title">
                  <h1>Confirm action</h1>
                </div>

                <p>Are you sure you want to edit your profile?</p>




                <div class="common-dialog-box-buttons-row">

                  <button class="common-dialog-box-confirm-button">Yes</button>

                  <button class="common-dialog-box-cancel-button">No</button>


                </div>

              </div> */}
                        </div>

                    </div>

                </Fragment >
            );

        }


    }
}

export default MainPage