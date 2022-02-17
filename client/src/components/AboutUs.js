import React, { useState, useContext } from 'react';
import { Fragment } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import shahbazDP from '../images/shahbaz_pic.jpeg';
import siddharthDP from '../images/Siddharth Dinkar.jpg';
import vasuDP from '../images/vasu.jpg';


const AboutUs = () => {

  const history = useHistory();
  return (
    <Fragment>

      <nav class="top-navbar" style={{ "position": "fixed" }}>

        <div class="navbar-heading">
          <h1>
            <Link to="/">
              Spaces!
            </Link>
          </h1>
        </div>

        <div class="navbar-buttons">

          <Link to="/Signup"><p style={{ "color": "white", "padding-right": "20px", "font-size": "20px" }}><u> Signup Now! </u></p></Link>


          {/* <button class="logout-button"><i class="fa fa-power-off"></i></button> */}

        </div>

      </nav>

      <div class="wrapper" style={{ "padding-top": "6%" }}>
        <div class="main_content">

          <div class="info" style={{ "min-height": "95%" }}>

            <div class="header" id="about">
              <h1 style={{ "text-align": "center" }}><Link to="AboutUs#about">About Spaces!</Link></h1>
              <br />

            </div>

            <div class="about-spaces-container" style={{ "text-align": "justify" }}>
              <p>Spaces: Online Collaboration Portal is a simple, easy to use website that would allow users to form different workspaces where they team up and work together. Each user can manage their own
                calendar, tasks and set goals. Users can interact with each other both one-to-one or as a team using built in chat and video calling functionalities. Users will also be able to express their ideas and implement them together using collaborative flowchart generator and collaborative code editor tools.
                Space admins have some additional privileges allowing them to exercise a better control over the phases of development and planning.
                Each team member could get an overview of the status from their respective dashboards.
                They could see the status of their progress on the tasks given to them by the space admin.
                Team members can visualize the assigned tasks in the form of a to-do list for their own reference.
                The website enables the user to see their upcoming, completed and ongoing goals.
                Using Spaces, development teams will have a great collaborative experience and better productivity.


                <br />
                <br />


              </p>

            </div>


          </div>

          <div class="info" style={{ "min-height": "95%" }}>


            <div class="header" id="features">
              <Link to="AboutUs#features">
                <h1 style={{ "text-align": "center" }}>Features</h1>
                <br />
              </Link>
            </div>
            <div class="about-spaces-container">
              <p>

                <br />

                <ul>
                  <li>Provides a <b>user friendly and intuitive  interface.</b></li>
                  <li>Lets each user <b>manage and modify their profile. </b></li>
                  <li>Lets you work on <b>multiple spaces.</b></li>
                  <li><b>Secure</b> and protected against unauthorized access. Authentication is done <b>using JWT(JSON Web Tokens).</b> </li>
                  <li>Provides all features needed to <b>easily plan, schedule and manage spaces</b> effectively.</li>
                  <li>Lets space admins easily <b>manage their space teams</b> and <b>assign tasks</b> to team members.</li>
                  <li>Provides all users with a <b>personalized calendar</b> containing tasks assigned to them and space goals.</li>
                  <li>Lets users communicate with each other in real time by means of <b>messaging and conferencing.</b></li>
                  <li>Lets users share ideas visually by <b>creating and saving flowcharts.</b></li>
                </ul>



                <br />


              </p>
            </div>


          </div>
          <div class="info" style={{ "min-height": "95%" }}>

            <br />

            <div class="header" id="team">
              <h1 style={{ "text-align": "center" }}>Our team</h1>
              <br />

            </div>

            <div class="our-team-row">

              <div class="our-team-card">
                <div class="our-team-card-pic"><img src={siddharthDP} alt="Picture" /></div>
                <div class="our-team-card-person-name"><h2>Siddharth Dinkar</h2></div>
                <div class="our-team-card-person-role"><h3>FULL STACK DEVELOPER</h3></div>
                <div class="our-team-card-description">
                  <p>Hi! I am Siddharth Dinkar. I love developing apps and websites with aim of creating a difference. Would love to connect.  </p>
                </div>
                <div class="our-team-buttons-row">
                  <a href="https://github.com/siddharth9901" target="_blank" title="Button One" class="our-team-button github">Github</a>
                  <a href="https://www.linkedin.com/in/siddharth-dinkar-3896b81b4/" target="_blank" title="Button One" class="our-team-button linkedIn">Linkedin</a>
                </div>
              </div>

              <div class="our-team-card">
                <div class="our-team-card-pic"><img src={shahbazDP} alt="Picture" /></div>
                <div class="our-team-card-person-name"><h2>Syed Shahbaz Husain</h2></div>
                <div class="our-team-card-person-role"><h3>DESIGN &#38; FRONT END</h3></div>
                <div class="our-team-card-description">
                  <p>Hi! I'm Syed Shahbaz Husain. I like to visualize interfaces and code them to reality. Also I'm always up for a game of chess. </p>
                </div>
                <div class="our-team-buttons-row">
                  <a href="https://github.com/Shahbaz-hus" target="_blank" title="Button One" class="our-team-button github">Github</a>
                  <a href="https://www.linkedin.com/in/shahbaz-husain-3155b21b9/" target="_blank" title="Button One" class="our-team-button linkedIn">Linkedin</a>
                </div>
              </div>
              <div class="our-team-card">
                <div class="our-team-card-pic"><img src={vasuDP} alt="Picture" /></div>
                <div class="our-team-card-person-name"><h2>Vasu Mandhanya</h2></div>
                <div class="our-team-card-person-role"><h3>FULL STACK DEVELOPER</h3></div>
                <div class="our-team-card-description">
                  <p>Hey! I am Vasu Mandhanya. I love learning new technologies and using them in spaces like this one. Feel free to get in touch.</p>
                </div>
                <div class="our-team-buttons-row">
                  <a href="https://github.com/Vasu-Mandhanya" target="_blank" title="Button One" class="our-team-button github">Github</a>
                  <a href="https://www.linkedin.com/in/vasu-mandhanya-3b50661a0/" target="_blank" title="Button One" class="our-team-button linkedIn">Linkedin</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default AboutUs