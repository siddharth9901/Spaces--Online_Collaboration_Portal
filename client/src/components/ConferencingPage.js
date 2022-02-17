import React, { Component, Fragment } from 'react';
import { v1 as uuid } from "uuid";
import axios from 'axios';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import { io } from "socket.io-client";
import videostyles from "../styleVideo.css";
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationList, Conversation, Avatar, ConversationHeader, StarButton, VoiceCallButton, VideoCallButton, InfoButton, Status } from '@chatscope/chat-ui-kit-react';
//import { group } from 'node:console';
import { withRouter, Redirect, Route } from "react-router-dom";
import Room from "./Room";
const jwt = require('jsonwebtoken');

class ConferencingPage extends Route {

    state = {
        loading: true,
        loadingMembers: true,
        loadingAdmin: true,
        conversations: null,
        admin: null,
        members: null,
        m: null,
        socket: null,
        messages: [],
        email: null,
        currentChat: "Group",
        currentChatName: "Group",
        currentChatID: null,
        OnlineUsers: [],
        message: "",
        callDisplay: { display: "none" },
        callType: "",
        callerID: "",
        callerName: "",
        callerSocketId: "",
        videocall: false,
        name: "",
        outgoingDisplay: { display: "none" }
    };

    constructor(props) {
        super(props);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        // this.message = React.createRef();
    }
    async getData() {
        // var email;
        // //var users = [];
        // if (localStorage.getItem('adminUsername')) {
        //     email = localStorage.getItem('adminUsername');
        // }
        // if (localStorage.getItem('username')) {
        //     email = localStorage.getItem('username');
        // }
        // const spaceID = localStorage.getItem('spaceID');
        const token = localStorage.getItem("token");
        const getSpaceDataURL = "https://spaces-server.herokuapp.com/getMyConversation/" + `${token}`;
        axios.get(`${getSpaceDataURL}`).then((res) => {
            console.log(res.data)
            this.setState({ conversations: res.data });
            console.log(this.state.conversations);
        }).catch(err => {
            console.log(err);
        })

        const getMembersDataURL = "https://spaces-server.herokuapp.com/viewContacts/" + `${token}`;
        axios.get(`${getMembersDataURL}`).then((res) => {
            console.log(res.data)
            this.setState({ members: res.data, loadingMembers: false });
            console.log("fddd", this.state.members);
            this.setState({ name: this.state.members.find((member) => member.email == jwt.decode(token).username)?.name })
        }).catch(err => {
            console.log(err);
        })

        //GETING Admin DATA:--->
        const getAdminDataURL = "https://spaces-server.herokuapp.com/viewAdmin/" + `${token}`;
        axios.get(`${getAdminDataURL}`).then((res) => {
            console.log(res.data)
            //users = users.push(res.data);
            this.setState({ admin: res.data, loadingAdmin: false });
            console.log("check3");
        }).catch(err => {
            console.log(err);
        })


        // if (jwt.decode(token).admin) {
        //     const email = localStorage.getItem('adminUsername');
        //     this.ProfileEmail = email;
        //     const getSpaceDataURL = "https://spaces-server.herokuapp.com/profileInfo/" + `${email}`;
        //     axios.get(`${getSpaceDataURL}`).then((res) => {
        //         console.log(res.data)
        //         this.setState({ user: res.data, loading: false });
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // }

        //const email = jwt.decode(token).username;
        //this.ProfileEmail = email;
        const getProfileDataURL = "https://spaces-server.herokuapp.com/profileInfo/" + `${token}`;
        axios.get(`${getProfileDataURL}`).then((res) => {
            console.log(res.data)
            this.setState({ user: res.data, loading: false });
        }).catch(err => {
            console.log(err);
        })

    }

    async componentWillMount() {
        console.log("COMPONENT WILL MOUNT")
        await this.getData();
        await this.getMessages();
        var email = ""
        // if (localStorage.getItem('adminUsername')) {
        //     email = localStorage.getItem('adminUsername');
        //     this.setState({ email: email });
        // }
        // if (localStorage.getItem('username')) {
        email = jwt.decode(localStorage.getItem('token')).username;
        this.setState({ email: email });
        //}
        //----------------------------SOCKET-------------------------------------
        this.setState({
            socket: io.connect("https://spaces-server.herokuapp.com/", {
                reconnection: false,
                forceNew: true,
                transports: ['websocket', 'polling', 'flashsocket']
            })
        });
        console.log(this.state.socket, this.state.socket.id);
        this.state.socket.on("Welcome", message => {
            console.log(message)
        })
        this.state.socket.emit("addUser", localStorage.getItem('token'));
        this.state.socket.on("getUsers", users => {
            console.log("Users List: ", users)
            var OnlineUsers = []
            for (var i = 0; i < users.length; i++) {
                OnlineUsers.push(users[i].userEmail)
            }
            this.setState({ OnlineUsers: OnlineUsers })
        })
        var Messages;
        this.state.socket.on("getMessage", (data) => {
            console.log("Recieved Message: ", data);
            if (this.state.currentChat == data.senderId) {
                Messages = this.state.messages;
                Messages.push({ sender: data.senderId, text: data.text, createdAt: Date.now() })
                this.setState({ messages: Messages });
            }
            if (this.state.currentChat == "Group" && data.type) {
                Messages = this.state.messages;
                Messages.push({ sender: data.senderId, text: data.text, createdAt: Date.now() })
                this.setState({ messages: Messages });
            }
        })
        this.state.socket.on("getCall", (type, senderId, socketId) => {
            console.log("Recieved Call: ", type, senderId, socketId);
            this.setState({ callType: type })
            this.setState({ callerID: senderId })
            this.setState({ callerSocketId: socketId })
            this.setState({ callDisplay: { display: "flex" } })
        })
        this.state.socket.on("Call Rejected", e => {
            console.log("Call Rejected")
            this.setState({ outgoingDisplay: { display: "none" } })
            this.setState({ callDisplay: { display: "none" } })
        })
        this.state.socket.on("Call Accepted", e => {
            console.log("Call Accepted")
            this.setState({ outgoingDisplay: { display: "none" } })
            const id = this.state.currentChatID;
            const { history } = this.props;
            if (history) history.push(`/Room/${id}/${this.state.videocall}/${this.state.user.name}`);
        })
    }

    getCurrentChat = async (recEmail) => {
        let email;
        //var users = [];
        // if (localStorage.getItem('adminUsername')) {
        //     email = localStorage.getItem('adminUsername');
        // }
        // if (localStorage.getItem('username')) {
        //     email = localStorage.getItem('username');
        // }
        // const spaceID = localStorage.getItem('spaceID');
        //GETING currentChatID:--->
        var obj;
        const getCurrentChatID = "https://spaces-server.herokuapp.com/getCurrentChatID/" + `${localStorage.getItem('token')}` + "/" + `${recEmail}`;
        axios.get(`${getCurrentChatID}`).then((res) => {
            console.log(res.data)
            obj = res.data;
        }).catch(err => {
            console.log(err);
        })
        return obj;
    }


    getMessages = async () => {
        // var email;
        // //var users = [];
        // if (localStorage.getItem('adminUsername')) {
        //     email = localStorage.getItem('adminUsername');
        // }
        // if (localStorage.getItem('username')) {
        //     email = localStorage.getItem('username');
        // }
        // const spaceID = localStorage.getItem('spaceID');
        //GETING currentChatID:--->
        const getCurrentChatID = "https://spaces-server.herokuapp.com/getCurrentChatID/" + `${localStorage.getItem('token')}` + "/" + `${this.state.currentChat}`;
        await axios.get(`${getCurrentChatID}`).then((res) => {
            console.log(res.data)
            //users = users.push(res.data);
            this.setState({ currentChatID: res.data[0]._id });
            console.log("check4", this.state.currentChatID);
            const getMessages = "https://spaces-server.herokuapp.com/getMessages/" + `${this.state.currentChatID}`;
            axios.get(`${getMessages}`).then((res) => {
                console.log(res.data)
                //users = users.push(res.data);
                var Messages = []
                for (var i = 0; i < res.data.length; i++) {
                    var message = { sender: res.data[i].sender, text: res.data[i].text, createdAt: res.data[i].createdAt }
                    Messages.push(message)
                }
                this.setState({ messages: Messages });
                console.log("check5", this.state.messages);
            }).catch(err => {
                console.log(err);
            })

            //const res=axios.get("https://spaces-server.herokuapp.com/getMessages/"+this.state.currentChatID)
            //GETING currentChatID:--->

        }).catch(err => {
            console.log(err);
        })


    }

    text = ""

    handleNewMessage() {
        // this.AdminId = localStorage.getItem("adminUsername");
        // this.emailDomain = this.AdminId.split("@")[1];
        //e.preventDefault();
        console.log("Message: ", this.state.message);
        if (this.state.message !== "") {
            this.text = this.state.message
            this.sendMessage();
            this.state.socket.emit("sendMessage", {
                senderId: this.state.email,
                receiverId: this.state.currentChat,
                text: this.text
            })
            setTimeout(() => {
                this.getData()
            }, 100)
            var Messages = this.state.messages;
            // if (!Messages) {
            //     Messages = [];
            // }
            console.log("Sureity:", this.email)
            if (this.state.currentChat != "Group") {
                var message = { sender: jwt.decode(localStorage.getItem('token')).username, text: this.text, createdAt: Date.now() }
                Messages.push(message);
                this.setState({ messages: Messages });
            }
        }
    }

    sendMessage = async () => {
        const res = await fetch("https://spaces-server.herokuapp.com/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                conversationId: this.state.currentChatID,
                sender: this.state.email,
                text: this.text
            })
        });
        const data = await res.json();
        if (res.status === 422 || !data) {
            window.alert("Invalid Request");
            console.log(data);
        } else if (res.status === 201) {
            console.log(this.emailID);
            console.log("Goal added Successfuly");
        }
    }

    //START VIDEO CHAT BUTTON CLICK:--->
    // create = props => {
    //     const roomID = uuid();
    //     console.log(roomID);
    //     this.render(){
    //     return(
    //     <Route path={`Room/:${roomID}`}component={<Room/>}></Route>
    //     )
    //     }
    //WORKING:---->
    create = props => {
        //const id = uuid();
        //const id = "zGJ63Ypg89gcMWPNAACd";
        this.state.socket.emit("Call", {
            senderId: this.state.email,
            receiverId: this.state.currentChat,
            type: "Video Call"
        })
        this.setState({ videocall: true })
        this.setState({ callType: "Video Call" })
        this.setState({ outgoingDisplay: { display: "flex" } })


        if (this.state.currentChat == "Group") {
            const id = this.state.currentChatID;
            const { history } = this.props;
            if (history) history.push(`/Room/${id}/true/${this.state.user.name}`);
        }
    }

    createaudio = props => {
        const name = this.state.members.find((member) => member.email === this.state.email)?.name;
        //const id = uuid();
        //const id = "zGJ63Ypg89gcMWPNAACd";
        this.state.socket.emit("Call", {
            senderId: this.state.email,
            receiverId: this.state.currentChat,
            type: "Audio Call"
        })

        this.setState({ callType: "Audio Call" })
        this.setState({ outgoingDisplay: { display: "flex" } })

        if (this.state.currentChat == "Group") {
            const id = this.state.currentChatID;
            const { history } = this.props;
            if (history) history.push(`/Room/${id}/false/${this.state.user.name}`);
        }
    }


    // CreateRoom = (props) => {
    //         const id = uuid();
    //         // props.history.push(`/ room / ${ id }`);

    //     return (
    //         <Room/>
    //     );
    // };

    render() {
        const { history } = this.props;
        let sidebar;
        sidebar = <Sidebar />


        // if (this.state.videocall != false) {
        //     return (
        //         <Redirect to={"/Room/" + this.state.videocall}></Redirect>
        //     )
        // }


        if (this.state.loadingAdmin || this.state.loadingMembers) {
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

                            {/* <div class="header">
                                <h1>Conferencing</h1>
                                <br />
                                <p>Space name: <b>{localStorage.getItem('spaceName')}</b></p>
                            </div> */}
                            <div style={{ position: "relative", height: "98%" }}>
                                <MainContainer>

                                    <ConversationList>

                                        <Conversation name="Team" onClick={async () => {
                                            this.setState({ currentChat: "Group" })
                                            this.setState({ currentChatName: "Group" })
                                            this.setState({ message: "" })
                                            this.setState({ messages: null })
                                            await this.getMessages()
                                            setTimeout(this.getMessages, 200)
                                        }}>

                                            <Avatar src={"http://ui-avatars.com/api/?name=Team"} name="Team" />

                                        </Conversation>




                                        {this.state.members.map(e => (
                                            <Conversation name={e.name} info={e.phone} onClick={async () => {
                                                console.log(e.email)
                                                this.setState({ currentChat: e.email })
                                                this.setState({ currentChatName: e.name })
                                                this.setState({ message: "" })
                                                this.setState({ messages: null })
                                                await this.getMessages();
                                                //setTimeout(this.getMessages, 200)
                                            }}>

                                                <Avatar src={"http://ui-avatars.com/api/?name=" + String(e.name)} name={e.name} status={this.state.OnlineUsers.includes(e.email) ? "available" : "unavailable"} />
                                                <Status status={this.state.OnlineUsers.includes(e.email) ? "available" : "unavailable"} />
                                            </Conversation>
                                        ))}



                                    </ConversationList>
                                    <ChatContainer>
                                        <ConversationHeader>

                                            {/* <ConversationHeader.Back /> */}

                                            <Avatar src={"http://ui-avatars.com/api/?name=" + String(this.state.currentChatName != "Group" ? this.state.currentChatName : "Team")} name={this.state.currentChatName} />

                                            <ConversationHeader.Content userName={this.state.currentChatName != "Group" ? this.state.currentChatName : "Team"} info={this.state.currentChat != "Group" ? this.state.OnlineUsers.includes(this.state.currentChat) ? "Online" : "Offline" : ""} styles={this.state.OnlineUsers.includes(this.state.currentChat) ? { color: "green" } : { color: "red" }} />

                                            <ConversationHeader.Actions>
                                                {/* <StarButton title="Add to favourites" /> */}
                                                {this.state.currentChat == "Group" ?
                                                    < VoiceCallButton title="Start voice call" onClick={this.createaudio} />
                                                    :
                                                    ""}
                                                {this.state.currentChat == "Group" ?
                                                    <VideoCallButton title="Start video call" onClick={this.create} />


                                                    :
                                                    ""}

                                                {/* <StarButton title="Add to favourites" /> */}
                                                {this.state.OnlineUsers.includes(this.state.currentChat) ?
                                                    < VoiceCallButton title="Start voice call" onClick={this.createaudio} />


                                                    :
                                                    ""}
                                                {this.state.OnlineUsers.includes(this.state.currentChat) ?
                                                    <VideoCallButton title="Start video call" onClick={this.create} />


                                                    :
                                                    ""}
                                                {/* <InfoButton title="Show info" /> */}

                                            </ConversationHeader.Actions>
                                            <Status status="available" size="xs" name="Available" style={{

                                                marginBottom: "0.5em"

                                            }} />

                                        </ConversationHeader>


                                        <MessageList>
                                            {
                                                this.state.messages ? this.state.messages.length !== 0 ? this.state.messages.map(M => (
                                                    <Message model={{
                                                        message: String(M.text),
                                                        sentTime: new Date(M.createdAt).toLocaleString(),
                                                        sender: String(M.sender),
                                                        direction: M.sender === this.state.email ? "outgoing" : "incoming",
                                                        position: "normal"
                                                    }
                                                    } >{this.state.currentChat == "Group" ? <Message.Header sender={this.state.members.find((member) => member.email === M.sender)?.name} sentTime="" /> : ""}
                                                        <Message.Footer sender="" sentTime={new Date(M.createdAt).toLocaleString()} />
                                                        {this.state.currentChat == "Group" ? M.sender !== this.state.email ? <Avatar src={"http://ui-avatars.com/api/?name=" + String(this.state.members.find((member) => member.email === M.sender)?.name)} name={String(M.sender)} /> : "" : ""}

                                                    </Message>

                                                )

                                                )
                                                    : <h1>Start a New Conversation</h1> : <div></div>
                                            }
                                        </MessageList>
                                        <MessageInput placeholder="Type message here" value={this.state.message} onChange={val => this.setState({ message: val })} onSend={() => {
                                            this.setState({ message: "" });
                                            this.handleNewMessage();
                                        }} attachButton={false} />
                                    </ChatContainer>
                                </MainContainer>

                            </div>



                            <div class="common-dialog-box-background" id="call_alert_dialog_box" style={this.state.callDisplay}>

                                <div class="common-dialog-box">

                                    <div class="common-dialog-box-title">
                                        <h1>Incoming {this.state.callType}</h1>
                                    </div>


                                    <br />


                                    <p>From:

                                        {/* <b>Team</b> */}
                                    </p>
                                    <p>
                                        <b>
                                            {this.state.members.find((member) => member.email === this.state.callerID)?.name}
                                        </b>
                                    </p>
                                    <br />

                                    <p style={{ "font-size": "16px" }}>
                                        {"          (" + this.state.callerID + ")"}
                                    </p>


                                    <br />

                                    <br />
                                    <br />



                                    <div class="common-dialog-box-buttons-row">
                                        <button class="reject-call-button" onClick={() => {
                                            this.state.socket.emit("Reject Call", { receiverId: this.state.callerID });
                                            this.setState({ callDisplay: { display: "none" } })
                                        }}>
                                            <i class="fas fa-phone" onClick={() => { this.setState({ callDisplay: { display: "none" } }) }}>
                                            </i>
                                        </button>
                                        <button class="accept-call-button" onClick={() => {
                                            this.state.currentChat = this.getCurrentChat(this.state.callerID)
                                            if (this.state.callType == "Video Call") {
                                                this.state.socket.emit("Accept Call", { receiverId: this.state.callerID });
                                                const id = this.state.currentChatID;
                                                const { history } = this.props;
                                                if (history) history.push(`/Room/${id}/true/${this.state.user.name}`);
                                            }
                                            else {
                                                this.state.socket.emit("Accept Call", { receiverId: this.state.callerID });
                                                this.state.socket.emit("Accept Call", this.state.callerID);
                                                const id = this.state.currentChatID;
                                                const { history } = this.props;
                                                if (history) history.push(`/Room/${id}/false/${this.state.user.name}`);
                                            }
                                        }}><i class="fas fa-phone"></i></button>

                                    </div>

                                </div>
                            </div>







                            <div class="common-dialog-box-background" id="call_outgoing_alert_dialog_box" style={this.state.outgoingDisplay}>

                                <div class="common-dialog-box">

                                    <div class="common-dialog-box-title">
                                        <h1>Outgoing Call </h1>
                                    </div>


                                    <br />


                                    <p>To:
                                    </p>
                                    <p>
                                        <b>{this.state.currentChatName}</b>
                                    </p>
                                    <br />
                                    <p style={{ "font-size": "16px" }} >
                                        ({this.state.currentChat})
                                    </p>
                                    <br />

                                    <br />
                                    <br />

                                    <div class="common-dialog-box-buttons-row">
                                        <button class="reject-call-button" onClick={() => {
                                            this.state.socket.emit("Reject Call", { receiverId: this.state.currentChat });
                                            this.setState({ outgoingDisplay: { display: "none" } })
                                        }}>
                                            <i class="fas fa-phone" onClick={() => {
                                                this.setState({ outgoingDisplay: { display: "none" } })
                                            }}>
                                            </i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Main content last line */}
                        </div>

                    </div>
                </Fragment >
            );

        }


    }
}

export default withRouter(ConferencingPage)