import React, { useState } from 'react';
//import express from 'express';
import { Link } from "react-router-dom";
import { NavLink, useHistory } from 'react-router-dom';
//import '../CSS/Signup.css'
//import './mainStyle.css';
const jwt = require('jsonwebtoken');



const Signup = () => {

  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    email: " ",
    phone: " ",
    skills: "",
    password: "",
    cpassword: ""
  });


  if (localStorage.getItem('token')) {
    var token = jwt.decode(localStorage.getItem('token'))
    console.log("Decoded Token: ", token)
    console.log(Date.now())
    if (Date.now() <= (token.exp * 1000)) {
      history.push("/OverviewPage");
    }
  }

  let name, value;//(#28 8:20)
  const handleInupts = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  }

  const PostData = async () => {//(e)
    // e.preventDefault();
    const { name, email, phone, skills, password, cpassword } = user;//Obj destructuring
    const res = await fetch("https://spaces-server.herokuapp.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, email, phone, skills, password, cpassword
      })
    });

    const data = await res.json();
    if (res.status === 422 || !data) {
      // document.getElementById('name_error').textContent = "Fill out name"
      window.alert("Invalid Registration");
      console.log("Email-ID already registered");
    } else if (res.status === 201) {
      window.alert(" Registration Successful");
      console.log(" Registration Successful");
      //if (Event.getAttribute("redirect")) {
      if (window.location.href.includes("redirect")) {
        localStorage.setItem('adminUsername', email);
        history.push("/CreateSpace")
      }
      else {
        history.push("/");
      }
    }
  }

  function validateForm(e) {
    e.preventDefault();
    var error = 0;
    var a = document.forms["createNew_user"]["name"].value;
    document.getElementById('name_error').innerHTML = '';
    if (a === null || a === "") {
      // alert("Name must be filled out");
      error++;
      document.getElementById('name_error').innerHTML = 'Name must be filled out';
    }

    var b = document.forms["createNew_user"]["email"].value;
    document.getElementById('email_error').innerHTML = '';
    if (b === null || b === "") {
      // alert("Email must be filled out");
      error++;
      document.getElementById('email_error').innerHTML = 'Email must be filled out';
    }

    var c = document.forms["createNew_user"]["phone"].value;
    document.getElementById('phone_error').innerHTML = '';
    if (c === null || c.length !== 10) {
      // alert("Username must be filled out");
      error++;
      document.getElementById('phone_error').innerHTML = 'Phone must be filled out';
    }

    var d = document.forms["createNew_user"]["skills"].value;
    document.getElementById('skills_error').innerHTML = '';
    if (d === null || d === "") {
      // alert("Password must be filled out");
      error++;
      document.getElementById('skills_error').innerHTML = 'Enter your skill set';
    }

    var e = document.forms["createNew_user"]["password"].value;
    document.getElementById('password_error').innerHTML = '';
    if (e === null || e === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('password_error').innerHTML = 'Please fill the Password';
    }

    var f = document.forms["createNew_user"]["cpassword"].value;
    document.getElementById('cpassword_error').innerHTML = '';
    if (f === null || f === "") {
      // alert("Roll no must be filled out");
      error++;
      document.getElementById('cpassword_error').innerHTML = 'Please confirm your Password';
    } else if (f !== e) {
      document.getElementById('cpassword_error').innerHTML = 'Passwords Dont Mach';
    }

    if (error === 0) {
      PostData();
    }

  }


  return (
    <div class="create-account-whole-page">
      <div class="create-account-container">
        <div class="title">Create Account</div>

        <form method="POST" name="createNew_user" className="register-form" id="register-form">
          <div class="create-account-user-details">





            <div class="create-account-input-box">
              <span>Full name</span>
              <input type="text" name="name" id="name"
                value={user.name}
                onChange={handleInupts}
                placeholder="Your Name"
              />
              <p class="error" id="name_error"></p>
            </div>

            <div class="create-account-input-box">
              <span>Email address</span>
              <input type="email" name="email" id="email"
                value={user.email}
                onChange={handleInupts}
                placeholder="Your email"
              />
              <p class="error" id="email_error"></p>
            </div>

            <div class="create-account-input-box">
              <span>Contact number</span>
              <input type="number" name="phone" id="phone"
                value={user.phone}
                onChange={handleInupts}
                placeholder="Your phone number"
              />
              <p class="error" id="phone_error"></p>
            </div>

            <div class="create-account-input-box">
              <span>Skill set</span>
              <input type="text" name="skills" id="skills"
                value={user.skills}
                onChange={handleInupts}
                placeholder="Enter skillset"
              />
              <p class="error" id="skills_error"></p>
            </div>

            <div class="create-account-input-box">
              <span>Set password</span>
              <input type="password" name="password" id="password"
                value={user.password}
                onChange={handleInupts}
                placeholder="Your password"
              />
              <p class="error" id="password_error"></p>
            </div>

            <div class="create-account-input-box">
              <span>Confirm password</span>
              <input type="password" name="cpassword" id="cpassword"
                value={user.cpassword}
                onChange={handleInupts}
                placeholder="Confirm password"
              />
              <p class="error" id="cpassword_error"></p>
            </div>


            <div class="create-account-input-box">
              <input type="submit" name="signup" id="signup" value="Sign Up"
                class="create_account"
                onClick={validateForm}
              />
            </div>

            <div class="create-account-input-box">
              <p>Already have an account? <Link to="/">Login</Link></p>
            </div>

            {/* <button onClick={PostData}>Take the Shot!</button>  */}

          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup