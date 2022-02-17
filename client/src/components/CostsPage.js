import React, { useState, useEffect, Fragment } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');

class CostsPage extends React.Component {
  state = {
    loading: true,
    projectBudget: 0,
    totalSpent: 0,
    costs: null,
    displayAddExpense: { display: 'none' },
    displayDeleteExpense: { display: 'none' }
  };

  constructor(props) {
    super(props);
    this.handleNewExpense = this.handleNewExpense.bind(this);
    this.handleRemoveExpense = this.handleRemoveExpense.bind(this);
    this.ExpenseName = React.createRef();
    this.ExpenseAmount = React.createRef();
    this.ExpenseDescription = React.createRef();
    this.currentObjectID = "";
  }
  token = localStorage.getItem("token");
  // dToken = jwt.decode(token)
  // projectID = dToken.projectID;
  // ManagerId = dToken.username;
  //emailDomain = this.ManagerId.split("@")[1];
  Name = ""
  amount = ""
  description = ""
  objectID = ""
  totalBudget = 0

  handleNewExpense(d) {
    d.preventDefault();
    this.Name = this.ExpenseName.current.value;
    this.amount = this.ExpenseAmount.current.value;
    this.description = this.ExpenseDescription.current.value;
    this.AddNewExpense();
    // this.setState({ displayAddExpense: { display: "none" } });
    setTimeout(() => {
      this.getData()
    }, 400)
    this.setState({ displayAddExpense: { display: 'none' } });
    this.ExpenseName.current.value = "";
    this.ExpenseAmount.current.value = "";
    this.ExpenseDescription.current.value = "";
  }
  AddNewExpense = async () => {
    const res = await fetch("https://spaces-server.herokuapp.com/addCost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        name: this.Name,
        description: this.description,
        amount: Number(this.amount)
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(this.projectID);
      console.log(this.Name);
      console.log(Number(this.amount));
    } else if (res.status === 201) {
      console.log(this.emailID);
      console.log("Expense added Successfuly");
    }

  }

  addCostButtonClick = () => {
    this.setState({ displayAddExpense: { display: 'block' } });
  }

  async getData() {
    // const email = localStorage.getItem('managerUsername')
    // console.log("working")
    // const emailDomain = email.substring(email.indexOf('@') + 1);
    // const projectID = localStorage.getItem('projectID');
    const getCostDataURL = "https://spaces-server.herokuapp.com/viewSpaceCosts" + "/" + `${this.token}`;
    const getProjectDataURL = "https://spaces-server.herokuapp.com/overview/" + `${this.token}`;
    axios.get(`${getCostDataURL}`).then((res) => {
      this.setState({ costs: res.data, loading: false });
      var t = 0;
      for (var i = 0; i < this.state.costs.length; i++) {
        t = t + Number(this.state.costs[i].amount);
        //console.log(this.state.costs[i].amount);
      }
      this.setState({ totalSpent: t });
    }).catch(err => {
      console.log(err);
    })

    //GET PROJECT DATA
    axios.get(`${getProjectDataURL}`).then((res) => {
      //this.setState({ project: res.data });
      this.totalBudget = res.data.budget;
      this.setState({ projectBudget: Number(res.data.budget) });
      console.log(res.data.budget);
    }).catch(err => {
      console.log(err);
    })

  }



  handleRemoveExpense(d) {
    d.preventDefault();
    this.removeExpense();
    setTimeout(() => {
      this.getData()
    }, 400)
    this.setState({ displayDeleteExpense: { display: "none" } });
  }

  removeExpense = async () => {
    const res = await fetch("https://spaces-server.herokuapp.com/removeCost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: this.token,
        costDocID: this.ObjectID,
      })
    });
    const data = await res.json();
    if (res.status === 422 || !data) {
      window.alert("Invalid Request");
      console.log(data);
    } else //if (res.status === 201) 
    {
      console.log(this.emailID);
      console.log("Cost Removed Successfuly");
    }
  }

  async componentDidMount() {
    this.getData();
  }

  render() {
    let sidebar;
    if (localStorage.getItem("token")) {
      var token = jwt.decode(localStorage.getItem("token"));
      console.log("Decoded Token: ", token);
      console.log(Date.now());
      if (Date.now() <= token.exp * 1000) {
        console.log("Token Not Expired");
        sidebar = <Sidebar />;
        if (!token.admin) {
          return (
            <>
              <Redirect to="/" />
            </>
          );
        }
      } else {
        console.log("Token Expired");
        localStorage.clear();
        return (
          <>
            {/* window.alert("Your Session Has Expired. Please Login"); */}
            <Redirect to="/" />
          </>
        );
      }
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
            <Sidebar />
            <div class="main_content">

              <div class="header">
                <h1>Costs</h1>
                <br />
                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
              </div>

              <div class="info">
                <br />

                <div class="cost-cards-row">

                  <div class="total-spent-card">

                    <div class="total-spent-card-row1">
                      <h3>Total spent:</h3>
                    </div>

                    <div class="total-spent-card-row2">
                      <h3>RS. {this.state.totalSpent}</h3>
                    </div>

                  </div>


                  <div class="budget-remaining-card">

                    <div class="budget-remaining-card-row1">
                      <h3>Budget remaining:</h3>
                    </div>

                    <div class="budget-remaining-card-row2">
                      <h3>RS. {this.state.projectBudget - this.state.totalSpent}</h3>


                    </div>


                  </div>

                </div>


                <br />
                <br />


                <div class="expenses-table">

                  <table class="content-table">
                    <thead>
                      <tr>
                        <th>Serial No.</th>
                        <th>Expense name</th>
                        <th>Description</th>
                        <th>Amount spent (in Rs.)</th>
                        <th>Delete</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.costs.map((Cost, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{Cost.name}</td>
                          <td>{Cost.description}</td>
                          <td>{Cost.amount}</td>
                          {/* <td styles="text-align:center"><button class="mark_as_complete_button" onClick={() => {
                              this.name = Milestone.name;
                              this.setState({ confirmMilestoneDisplay: { display: 'block' } });
                              this.ObjectID = Milestone._id;
                              console.log("click: ", this.ObjectID)
                            }
                            }>
                              <i class="fas fa-check"></i></button></td> */}
                          <td styles="text-align:center"><button class="delete_table_row_button" onClick={() => {
                            this.name = Cost.name;
                            this.setState({ displayDeleteExpense: { display: 'block' } });
                            this.ObjectID = Cost._id;
                            console.log("click: ", this.ObjectID)
                          }
                          }><i class="far fa-trash-alt"></i></button></td>
                        </tr>

                      ))}
                    </tbody>
                  </table>

                </div>


                <div class="cost-buttons-row">
                  <button class="add-expense-button"
                    onClick={this.addCostButtonClick}
                  >Add New Expense</button>

                </div>


                <div class="common-dialog-box-background" id="add-expense-dialog-box" style={this.state.displayAddExpense}>

                  <div class="common-dialog-box">

                    <div class="common-dialog-box-title">
                      <h1>Add a new expense</h1>
                    </div>


                    <form action="#">

                      <div class="common-dialog-box-details">

                        <div class="common-dialog-box-input-box">
                          <span>Expense Name</span>
                          <input type="text" ref={this.ExpenseName} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Amount spent</span>
                          <input type="text" ref={this.ExpenseAmount} />
                        </div>

                        <div class="common-dialog-box-input-box">
                          <span>Expense description</span>
                          <input type="text" ref={this.ExpenseDescription} />
                        </div>

                      </div>

                    </form>



                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={this.handleNewExpense} >Add expense</button>

                      <button class="common-dialog-box-cancel-button" onClick={() => {
                        this.setState({ displayAddExpense: { display: 'none' } })
                      }}>Cancel</button>


                    </div>

                  </div>
                </div>




                <div class="common-dialog-box-background" id="remove-expense-dialog-box" style={this.state.displayDeleteExpense}>

                  <div class="common-dialog-box">

                    <div class="common-dialog-box-title">
                      <h1>{this.name}</h1>
                    </div>
                    <br />
                    <br />
                    <p>Are you sure you want delete this expense?</p>
                    <br />
                    <br />


                    {/* <form action="#">

                      <div class="common-dialog-box-details">


                        <div class="common-dialog-box-input-box">
                          <span><b>Serial No. </b>(of expense to be deleted)</span>
                          <input type="text" />
                        </div>

                      </div>

                    </form> */}



                    <div class="common-dialog-box-buttons-row">

                      <button class="common-dialog-box-confirm-button" onClick={this.handleRemoveExpense}>Remove expense</button>

                      <button class="common-dialog-box-cancel-button" onClick={() => {
                        this.setState({ displayDeleteExpense: { display: 'none' } })
                      }}>Cancel</button>

                    </div>





                  </div>
                </div>



              </div>
            </div>

          </div>



          {/* <script type="text/javascript">
  var c = document.getElementById('add-expense-dialog-box');
  var d = document.getElementById('remove-expense-dialog-box');
  function show_add_expense_alert_box(){
    c.style.display = 'block';
  }

  function hide_add_expense_alert_box(){
    c.style.display = 'none';
  }

  function show_remove_expense_alert_box(){
    d.style.display = 'block';
  }

  function hide_remove_expense_alert_box(){
    d.style.display = 'none';
  }

</script>       */}



        </Fragment >




      );






    }


  }
}

export default CostsPage