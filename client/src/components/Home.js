import React, { useState, useContext } from 'react';
//import '../CSS/Home.css';
//import "bootstrap/dist/css/bootstrap.min.css";
//import './mainStyle.css';
import img1 from "../images/login_background.png"
import { NavLink, useHistory } from 'react-router-dom';
//import Cookies from 'js-cookie';
import axios from 'axios';
import { SidebarContext } from './SidebarContext';
import { Link } from "react-router-dom";

const Home = () => {
  const jwt = require('jsonwebtoken');
  const { value, setValue } = useContext(SidebarContext);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueSpaceId, setuniqueSpaceId] = useState('');

  if (localStorage.getItem('token')) {
    var token = jwt.decode(localStorage.getItem('token'))
    console.log("Decoded Token: ", token)
    console.log(Date.now())
    if (Date.now() <= (token.exp * 1000)) {
      history.push("/OverviewPage");
    }
  }

  const loginUser = async (e) => {
    e.preventDefault();
    const res = await fetch('https://spaces-server.herokuapp.com/signin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, body: JSON.stringify({
        email, password, uniqueSpaceId
      })
    })
    const data = await res.json();
    console.log(data);
    if (res.status === 400 || !data) {
      window.alert("Invalid Credentials");
      //console.log();
    } else if (res.status === 202) {
      console.log(data);
      // localStorage.setItem('adminUsername', email);
      // localStorage.setItem('spaceID', uniqueSpaceId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('sidebar', "expanded");
      setValue("expanded");
      console.log("Admin LoggedIn");
      history.push("/OverviewPage");
    }
    else {
      console.log(data);
      window.alert("Login Successful");
      // localStorage.setItem('username', email);
      // localStorage.setItem('spaceID', uniqueSpaceId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('sidebar', "expanded");
      setValue("expanded")
      console.log(localStorage.getItem('username'));
      // axios({
      //   method: "POST",
      //   url: "https://spaces-server.herokuapp.com/overview"
      // })
      history.push("/OverviewPage");
    }
  }

  function createSpace() {
    history.push("/CreateSpaceLogin");
  }

  return (
    <section class="login-section">
      <div class="imgBx">
        <img src={img1} alt="Login" />
        <div class="intro_text_over_image">
          <h1>
            <Link to="/AboutUs"> &nbsp;Spaces</Link>
          </h1>

          <p>
            Online Collaboration Portal
          </p>
          <br /><br />
          <p class="aboutUsLink">Want to know More... <Link to="/AboutUs"> About Us</Link></p>
        </div>
      </div>

      <div class="contentBx">
        <div class="formBx">
          {/* <h1 style = {{"margin-left": "12em", "margin-bottom": "15px"}} > Yo!</h1>  */}
          <h2>Login</h2>
          <form method="POST" >
            <div class="inputBx">
              <span>Email address</span>
              <input type="email" name="email" id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email-id" />
            </div>

            <div class="inputBx">
              <span>Password</span>
              <input type="password" name="password" id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div class="inputBx">
              <span>Space id</span>
              <input type="text" name="uniqueSpaceId" id="uniqueSpaceId"
                value={uniqueSpaceId}
                onChange={(e) => setuniqueSpaceId(e.target.value)}
                placeholder="Enter Unique Space-ID"
              />
            </div>

            <div class="inputBx">
              <input type="submit" value="Login" class="Login"
                onClick={loginUser}
              />
            </div>

            <div class="inputBx">
              <p>Don't have an account? <Link to="/Signup">Sign Up</Link></p>
            </div>

            <div class="inputBx">
              <h3>or</h3>
            </div>

            <div class="inputBx">
              <input type="submit" value="Create new space" class="Space"
                onClick={createSpace}
              />
            </div>



          </form>
        </div>

      </div>
    </section>
  )
}

export default Home