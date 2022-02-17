import React, { useState, useEffect, Fragment } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import FlowChart from 'flowchart.js';
import AceEditor from 'react-ace';
import { browserHistory, Redirect } from 'react-router-dom'
import "ace-builds/src-noconflict/theme-monokai";
//import Flowchart from 'react-simple-flowchart';
const jwt = require('jsonwebtoken');

class FlowChartPage extends React.Component {
    constructor(props) {
        super(props);
        this.FlowChartName = React.createRef();
        this.code = React.createRef();
        this.handleSaveFlowchart = this.handleSaveFlowchart.bind(this);
        this.handleUpdateFlowchart = this.handleUpdateFlowchart.bind(this);
    };

    opt = {
        x: 0,
        y: 0,
        'line-width': 3,
        'line-length': 50,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        fill: 'white',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        scale: 1,
        symbols: {
            start: {
                'font-color': 'white',
                'element-color': 'green',
                'font-weight': '400',
                'fill': 'green',
            },
            end: {
                'font-color': 'white',
                'element-color': 'red',
                'font-weight': '400',
                'fill': 'red',
            },
            operation: {
                'font-color': 'white',
                'element-color': 'blue',
                'font-weight': '400',
                'fill': 'blue',

            },
            condition: {
                'font-color': 'white',
                'element-color': 'orange',
                'font-weight': '400',
                'fill': 'orange',

            },
            parallel: {
                'font-color': 'white',
                'element-color': 'darkmagenta',
                'font-weight': '400',
                'fill': 'darkmagenta',

            },
            inputoutput: {
                'font-color': 'white',
                'element-color': 'saddlebrown',
                'font-weight': '400',
                'fill': 'saddlebrown',
            },
            subroutine: {
                'font-color': 'white',
                'element-color': 'slategrey',
                'font-weight': '400',
                'fill': 'slategrey',
            }
        },
        flowstate: {
            department1: { fill: 'pink' },
            department2: { fill: 'yellow' },
            external: { fill: 'green' },

        },
    }

    state = {
        diagram: null,
        elementText: 'none',
        code: "",
        flowcharts: null,
        flowchartID: "",
        loading: true
    }



    handleCodeChange(e) {
        //e.preventDefault();
        console.log(this.code.current.value)
        try {
            const flowNew = FlowChart.parse(this.code.current.value);
            if (this.chart) {
                try {
                    this.chart.removeChild(this.chart.children[0]);
                } catch (err) {
                    console.log("Child Error", err)
                }

                flowNew.drawSVG(this.chart, this.opt);
            }
            this.setState({ code: this.code.current.value });
        } catch (err) {
            console.log("Syntax Error", err)
        }
    }
    Name = ""
    Code = ""
    // spaceID = ""
    // emailDomain = ""
    flowchartDocID = ""

    handleSaveFlowchart(e) {
        e.preventDefault();
        // this.spaceID = localStorage.getItem('spaceID');
        // this.emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     this.emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     this.emailDomain = localStorage.getItem('username').split("@")[1];
        // }
        console.log("Clicked");
        this.Name = this.FlowChartName.current.value;
        this.Code = this.code.current.value;
        this.AddNewFlowchart()
        setTimeout(() => {
            this.getData();
        }, 400)
    }

    AddNewFlowchart = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/addFlowchart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                // spaceID: this.spaceID,
                // emailDomain: this.emailDomain,
                name: this.Name == "" ? "Untitled" : this.Name,
                code: this.Code
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Please type some code!");
        } else if (res.status === 201) {
            window.alert("Flowchart added Successfuly");
        }

    }
    //UPDATE FLOWCHART:--->
    handleUpdateFlowchart(e) {
        e.preventDefault();
        // this.spaceID = localStorage.getItem('spaceID');
        // this.emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     this.emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     this.emailDomain = localStorage.getItem('username').split("@")[1];
        // }
        //console.log("Clicked");
        this.Name = this.FlowChartName.current.value;
        this.Code = this.code.current.value;
        this.UpdateFlowchart()
        setTimeout(() => {
            this.getData();
        }, 400)
    }
    UpdateFlowchart = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/updateFlowchart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                flowchartDocID: this.state.flowchartID,
                // spaceID: this.spaceID,
                // emailDomain: this.emailDomain,
                name: this.Name,
                code: this.Code,
                token: localStorage.getItem('token')
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Invalid Request");
        } else if (res.status === 201) {
            window.alert("Flowchart updated Successfuly");
        }

    }


    handleOptChange(e) {
        e.preventDefault();
        this.opt = JSON.parse(e.target.value)
    }

    handleDeletion(e) {
        // this.spaceID = localStorage.getItem('spaceID');
        // this.emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     this.emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     this.emailDomain = localStorage.getItem('username').split("@")[1];
        // }
        this.flowchartDocID = String(e);
        console.log("Clicked: Delete");
        this.DeleteFlowchart()
        setTimeout(() => {
            this.getData();
        }, 400)
    }

    DeleteFlowchart = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/removeFlowchart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // spaceID: this.spaceID,
                // emailDomain: this.emailDomain,
                token: localStorage.getItem('token'),
                flowchartDocID: this.flowchartDocID
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Invalid Request");
        } else if (res.status === 201) {
            window.alert("Flowchart deleted Successfuly");
        }
    }


    handleDownload(e) {
        e.preventDefault();
        var svg = document.getElementsByTagName("svg");
        var svgcontent = svg[0].outerHTML;
        console.log(svgcontent)
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:image/svg+xml,' + encodeURIComponent(svgcontent);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'flowchart.svg';
        hiddenElement.click();
    }


    async getData() {
        // var emailDomain = ""
        // if (localStorage.getItem('adminUsername')) {
        //     emailDomain = localStorage.getItem('adminUsername').split("@")[1];
        // }
        // else {
        //     emailDomain = localStorage.getItem('username').split("@")[1];
        // }

        // console.log("Domain:", emailDomain);
        // const spaceID = localStorage.getItem('spaceID');
        var token = localStorage.getItem('token')
        const getSpaceFlowchartsURL = "https://spaces-server.herokuapp.com/viewSpaceFlowcharts/" + `${token}`;
        console.log("Getting Data");
        axios.get(`${getSpaceFlowchartsURL}`).then((res) => {
            //console.log(this.state.tasks);
            // var Flowcharts = []
            // // for (var i = 0; i < res.data.length; i++) {
            // //     Flowcharts.push(res.data[i]);
            // // }
            console.log(res);
            console.log("loaded");
            this.setState({ flowcharts: res.data, loading: false });
            // console.log(this.state.inProgressTasks);
        }).catch(err => {
            console.log(err);
        })
    }

    componentWillMount() {
        this.getData();
    }


    render() {
        console.log("re-rendered");
        let sidebar;
        if (localStorage.getItem('token')) {
            var token = jwt.decode(localStorage.getItem('token'))
            console.log("Decoded Token: ", token)
            console.log(Date.now())
            if (Date.now() <= (token.exp * 1000)) {
                console.log("Token Not Expired");
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

        // if (localStorage.getItem('adminUsername')) {
        //     sidebar = <Sidebar />
        // } else {
        //     sidebar = <SidebarDeveloper />
        // }
        if (this.state.loading) {
            return (<div class="load_data">
                <div class="loader"></div>
                <br />
                Loading
            </div>);
        }
        else {
            return (
                <Fragment>
                    <Navbar />
                    <div class="wrapper">
                        {sidebar}
                        <div class="previous-flowchart-container">

                            <div class="previous-flowcharts-heading">
                                <p>Previous Flow charts</p>
                            </div>

                            <br></br>
                            {this.state.flowcharts ? this.state.flowcharts.map(flowchart => (
                                < div class={this.state.flowchartID === flowchart._id ? "previous-flowchart-elements active" : "previous-flowchart-elements"} id="first_flowchart_element" onClick={
                                    () => {
                                        this.code.current.value = flowchart.code;
                                        this.FlowChartName.current.value = flowchart.name;
                                        this.setState({ flowchartID: flowchart._id })
                                        this.handleCodeChange();
                                    }
                                }>
                                    <p>{flowchart.name}</p>
                                    <button onClick={() => {
                                        this.handleDeletion(flowchart._id)
                                    }}><i class="far fa-trash-alt"></i></button>
                                </div>
                            )) : ""}
                            {/* 
        <div class="previous-flowchart-elements" id="first_flowchart_element">
            <p>Flowchart1</p>
        </div>

        <div class="previous-flowchart-elements">
            <p>Flowchart2</p>
        </div>

        <div class="previous-flowchart-elements">
            <p>Flowchart3</p>
        </div> */}

                        </div>
                        <div class="main_content">

                            <div class="main_content_flowchart">
                                <div class="header">
                                    {/* <h1>Flowchart</h1>
                                <br />
                                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                            </div> */}
                                    <div class="flowchart">

                                        <div class="flowchart-whole-container">



                                            <div class="flowchart-row">

                                                <div class="flowchart-name-row">
                                                    <p>Enter name of flowchart</p>
                                                    <input type="text" ref={this.FlowChartName} placeholder="Flowchart Name" />
                                                </div>


                                                <br />
                                                <br />


                                                {/* <p>Edit flowchart in real time!</p> */}



                                                <div class="flowchart-code-area">


                                                    <br />
                                                    <br />

                                                    <div id="ACE">
                                                        <AceEditor
                                                            //mode="java"
                                                            theme="monokai"
                                                            value={this.code.current == null ? "" : this.code.current.value}
                                                            //onChange={onChange}
                                                            //name="ACE"
                                                            editorProps={{ $blockScrolling: true }}
                                                            //ref={this.ace}
                                                            onChange={(val) => {

                                                                this.code.current.value = val;
                                                                this.handleCodeChange()
                                                            }}

                                                        />
                                                    </div>
                                                    <textarea class="flowchart-text-box1"
                                                        cols="80"
                                                        rows="10"
                                                        ref={this.code}
                                                        style={{ color: 'white', display: 'none' }}
                                                        onChange={(e) => this.handleCodeChange(e)}
                                                    />

                                                    {/* </div> */}

                                                    <br></br>
                                                    <br></br>

                                                    {/* <div class="break"></div> */}
                                                    {/* <hr></hr> */}

                                                    <div class="flowchart-image-area">
                                                        {/* <p>Result</p> */}
                                                        {this.code.current == null ?
                                                            <section>
                                                                <h1>Type code in editor to render flowchart.</h1>
                                                                <h1>Example:-  </h1>
                                                                <p>st=>start: Start:>http://www.vit.ac.in</p>
                                                                <p>e=>end:>http://www.vit.ac.in</p>
                                                                <p>op1=>operation: My Operation</p>
                                                                <p>sub1=>subroutine: My Subroutine</p>
                                                                <p>cond=>condition: Yes</p>
                                                                <p>or No?:>http://www.vit.ac.in</p>
                                                                <p>io=>inputoutput: catch something...</p>
                                                                <p>para=>parallel: parallel tasks</p>
                                                                <p>st->op1->cond</p>
                                                                <p>cond(yes)->io->e</p>
                                                                <p>cond(no)->para</p>
                                                                <p>para(path1, bottom)->sub1(right)->op1</p>
                                                                <p>para(path2, top)->op1</p>
                                                            </section> :
                                                            this.code.current.value == "" ?
                                                                <section>
                                                                    <h1>Type code in editor to render flowchart.</h1>
                                                                    <h1>Example:-  </h1>
                                                                    <p>st=>start: Start:>http://www.vit.ac.in</p>
                                                                    <p>e=>end:>http://www.vit.ac.in</p>
                                                                    <p>op1=>operation: My Operation</p>
                                                                    <p>sub1=>subroutine: My Subroutine</p>
                                                                    <p>cond=>condition: Yes</p>
                                                                    <p>or No?:>http://www.vit.ac.in</p>
                                                                    <p>io=>inputoutput: catch something...</p>
                                                                    <p>para=>parallel: parallel tasks</p>
                                                                    <p>st->op1->cond</p>
                                                                    <p>cond(yes)->io->e</p>
                                                                    <p>cond(no)->para</p>
                                                                    <p>para(path1, bottom)->sub1(right)->op1</p>
                                                                    <p>para(path2, top)->op1</p>
                                                                </section> : " "}
                                                        <div ref={div => this.chart = div}
                                                        // onClick={e => this.handleClick(e)} 
                                                        />
                                                        {/* {<p>Last Clicked Node: <strong>{elementText}</strong></p>
                                            <br></br>
                                            <br></br>

                                        </div>

                                        <br></br>
                                                <br></br>*/}

                                                        {/* <div class="break"></div> */}





                                                    </div>

                                                </div>

                                                <br />
                                            </div>


                                        </div>
                                        <div class="common-dialog-box-buttons-row">

                                            <button class="common-dialog-box-confirm-button" onClick={this.handleDownload}>Export as SVG</button>

                                            <button class="common-dialog-box-cancel-button" onClick={this.handleSaveFlowchart}>Save code to backend</button>

                                            {
                                                this.state.flowchartID.trim() != "" ?
                                                    <div class="common-dialog-box-buttons-row">

                                                        <button class="common-dialog-box-confirm-button" onClick={this.handleUpdateFlowchart}>Update Flowchart</button>

                                                    </div> : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment >
            );

        }


    }
}

export default FlowChartPage


