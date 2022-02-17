import React, { useState } from 'react';
//import express from 'express';
import { NavLink, useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
//import '../CSS/mainStyle.css'



const CreateSpaceLogin = () => {

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Login = async (e) => {
    e.preventDefault();
    const res = await fetch('https://spaces-server.herokuapp.com/createNewSpaceSignin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, body: JSON.stringify({
        email, password
      })
    });
    const data = res.json();

    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
    } else {
      window.alert("Login Successful");
      localStorage.setItem('adminUsername', email);
      console.log(localStorage.getItem('adminUsername'));
      history.push("/CreateSpace");
    }
  }



  return (

    <div class="create-new-space-login-whole-page">
      <div class="create-new-space-login-container">
        <div class="title">Login</div>
        <form action="#">
          <div class="create-new-space-login-user-details">



            <div class="create-new-space-login-input-box">
              <span>Email address</span>
              <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email-id"
              />
            </div>

            <div class="create-new-space-login-input-box">
              <span>Password</span>
              <input type="password" name="password" id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>


            <div class="create-new-space-login-input-box">
              <input type="submit" value="Login" class="create_account" onClick={Login} />
            </div>

            <div class="create-new-space-login-input-box">
              <p>New here? <Link to="./Signup?redirect=CreateSpaceLogin">Sign Up</Link></p>
            </div>


          </div>

        </form>
      </div>

    </div>

  )
}

export default CreateSpaceLogin