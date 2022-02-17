import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { browserHistory, Redirect } from 'react-router-dom'
import img_404 from '../images/svgs/404.svg';
import astronaut_img from '../images/svgs/astronaut.svg';
import moon_img from '../images/svgs/moon.svg';
import rocket_img from '../images/svgs/rocket.svg';
import earth_img from '../images/svgs/earth.svg';
import { Link } from "react-router-dom";
const jwt = require('jsonwebtoken');


//import './App.css';
function PageNotFound() {
  var link = "./Spaces-client/"
  if (localStorage.getItem('token')) {
    var token = jwt.decode(localStorage.getItem('token'))
    console.log("Decoded Token: ", token)
    console.log(Date.now())
    if (Date.now() <= (token.exp * 1000)) {
      console.log("Token Not Expired")
      link = "/OverviewPage"
    }
  }
  return (
    <div class="stars">
      <div class="central-body">
        <img class="image-404" src={img_404} width="300px" />
        <Link to={link} class="btn-go-home">GO BACK HOME</Link>
      </div>
      <div class="objects">
        <img class="object_rocket" src={rocket_img} width="40px" />
        <div class="earth-moon">
          <img class="object_earth" src={earth_img} width="100px" />
          <img class="object_moon" src={moon_img} width="80px" />
        </div>
        <div class="box_astronaut">
          <img class="object_astronaut" src={astronaut_img} width="140px" />
        </div>
      </div>
      <div class="glowing_stars">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>

      </div>
    </div >

  );
}


export default PageNotFound;