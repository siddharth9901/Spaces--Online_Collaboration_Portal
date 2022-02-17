import { Route, Switch } from "react-router-dom";
import React, { useState } from 'react';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Signup from './components/Signup';
import CreateSpace from './components/CreateSpace';
import CreateSpaceLogin from './components/CreateSpaceLogin';
import OverviewPage from './components/OverviewPage';
import TeamManagement from './components/TeamManagement';
import ProfilePage from './components/ProfilePage';
import TasksPage from './components/TasksPage';
import GoalsPage from './components/GoalsPage';
import PageNotFound from './components/PageNotFound';
import CalendarPage from './components/CalendarPage';
import FlowChartPage from './components/FlowChartPage';
import EditorPage from './components/EditorPage';
import ConferencingPage from './components/ConferencingPage';
import MainPage from "./components/MainPage";
import Room from './components/Room';
import CostsPage from './components/CostsPage';
import ResourcesPage from './components/ResourcesPage';
import { SidebarContext } from "./components/SidebarContext";
import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');


const App = () => {
  const [value, setValue] = useState(localStorage.getItem("sidebar") == null ? "expanded" : localStorage.getItem("sidebar"));
  if (localStorage.getItem('token')) {
    var token = jwt.decode(localStorage.getItem('token'))
    console.log("Decoded Token: ", token)
    console.log(Date.now())
    if (Date.now() <= (token.exp * 1000)) {
      console.log("Token Not Expired")
      return (
        <>
          <SidebarContext.Provider value={{ value, setValue }}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/Signup">
                <Redirect to='/OverviewPage' />
              </Route>
              <Route path="/AboutUs">
                <AboutUs />
              </Route>
              <Route path="/CreateSpace">
                <CreateSpace />
              </Route>
              <Route path="/CreateSpaceLogin">
                <CreateSpaceLogin />
              </Route>
              <Route path="/OverviewPage">
                <OverviewPage />
              </Route>
              <Route path="/TeamManagement">
                <TeamManagement />
              </Route>
              <Route path="/GoalsPage">
                <GoalsPage />
              </Route>
              <Route path="/TasksPage">
                <TasksPage />
              </Route>
              <Route path="/ProfilePage">
                <ProfilePage />
              </Route>
              <Route path="/CalendarPage">
                <CalendarPage />
              </Route>
              <Route path="/FlowChartPage">
                <FlowChartPage />
              </Route>
              <Route path="/EditorPage">
                <EditorPage />
              </Route>
              <Route path="/CostsPage">
                <CostsPage />
              </Route>
              <Route path="/ResourcesPage">
                <ResourcesPage />
              </Route>
              <Route path="/ConferencingPage">
                <ConferencingPage />
              </Route>
              {/* <Route path="/MainPage">
                <MainPage />
              </Route> */}
              <Route path="/room/:roomID/:video/:name" component={Room} />
              <Route>
                <PageNotFound />
              </Route>
            </Switch>
          </SidebarContext.Provider>
        </>
      )
    }
    else {
      console.log("Token Expired")
      window.alert("Your Session Has Expired. Please Login");
      localStorage.clear();
      return (
        <>
          <SidebarContext.Provider value={{ value, setValue }}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/Signup">
                <Signup />
              </Route>
              <Route path="/AboutUs">
                <AboutUs />
              </Route>
              <Route path="/CreateSpace">
                <CreateSpace />
              </Route>
              <Route path="/CreateSpaceLogin">
                <CreateSpaceLogin />
              </Route>
              <Route path="/OverviewPage">
                <OverviewPage />
              </Route>
              <Route path="/TeamManagement">
                <Redirect to='/' />
              </Route>
              <Route path="/GoalsPage">
                <Redirect to='/' />
              </Route>
              <Route path="/TasksPage">
                <Redirect to='/' />
              </Route>
              <Route path="/ProfilePage">
                <Redirect to='/' />
              </Route>
              <Route path="/CalendarPage">
                <Redirect to='/' />
              </Route>
              <Route path="/FlowChartPage">
                <Redirect to='/' />
              </Route>
              <Route path="/EditorPage">
                <Redirect to='/' />
              </Route>
              <Route path="/CostsPage">
                <Redirect to='/' />
              </Route>
              <Route path="/ResourcesPage">
                <Redirect to='/' />
              </Route>
              <Route path="/ConferencingPage">
                <Redirect to='/' />
              </Route>
              <Route path="/Room">
                <Redirect to='/' />
              </Route>
              {/* <Route path="/MainPage">
                <Redirect to='/' />
              </Route> */}
              <Route>
                <PageNotFound />
              </Route>
            </Switch>
          </SidebarContext.Provider>
        </>
      )
    }
  }
  else {
    return (
      <>
        <SidebarContext.Provider value={{ value, setValue }}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/Signup">
              <Signup />
            </Route>
            <Route path="/AboutUs">
              <AboutUs />
            </Route>
            <Route path="/CreateSpace">
              <CreateSpace />
            </Route>
            <Route path="/CreateSpaceLogin">
              <CreateSpaceLogin />
            </Route>
            <Route path="/OverviewPage">
              <OverviewPage />
            </Route>
            <Route path="/TeamManagement">
              <Redirect to='/' />
            </Route>
            <Route path="/GoalsPage">
              <Redirect to='/' />
            </Route>
            <Route path="/TasksPage">
              <Redirect to='/' />
            </Route>
            <Route path="/ProfilePage">
              <Redirect to='/' />
            </Route>
            <Route path="/CalendarPage">
              <Redirect to='/' />
            </Route>
            <Route path="/FlowChartPage">
              <Redirect to='/' />
            </Route>
            <Route path="/EditorPage">
              <Redirect to='/' />
            </Route>
            <Route path="/ConferencingPage">
              <Redirect to='/' />
            </Route>
            <Route path="/Room">
              <Redirect to='/' />
            </Route>
            <Route path="/MainPage">
              <Redirect to='/' />
            </Route>
            <Route>
              <PageNotFound />
            </Route>
          </Switch>
        </SidebarContext.Provider>
      </>
    )
  }
}
export default App