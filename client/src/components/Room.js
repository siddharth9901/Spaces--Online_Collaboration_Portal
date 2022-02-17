import React, { useEffect, useRef, useState, Fragment } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Avatar } from '@chatscope/chat-ui-kit-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Link } from "react-router-dom";

import { browserHistory, Redirect } from 'react-router-dom'
const jwt = require('jsonwebtoken');
const Container = styled.div`
    padding: 20px;
    display: flex;
    min-height: 85vh;
    width: 90%;
    margin: 1px;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 100% !important;    
    width: 100% !important;
    
`;

const Video = (props) => {
    console.log("New check 3:", props)
    const ref = useRef();
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);
    console.log("New Check: ", props.Key1)
    return (
        <div class="video-box">
            <StyledVideo id={"video" + props.Key1} playsInline autoPlay ref={ref} poster={"http://ui-avatars.com/api/?name=" + props.name + "&size=72&rounded=true"}>
            </StyledVideo >
            <Avatar id={"avatar" + props.Key1} src={"http://ui-avatars.com/api/?name=" + props.name} size="lg" style={{ display: "none" }} />
            <div class="name-in-video">
                <p> {props.name} <i id={"mic" + props.Key1} class="fa fa-microphone" aria-hidden="true"></i></p>
            </div>

        </div >
    );
}


// const videoConstraints = {
//     height: window.innerHeight / 2,
//     width: window.innerWidth / 2
// };

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const defaultVideoConstraints = {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 360, ideal: 720, max: 1080 }
    }
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoConstraints, setVideoConstraints] = useState(defaultVideoConstraints);
    const [audioConstraints, setAudioConstraints] = useState(true);
    const [reloadHelper, setReloadHelper] = useState(true);
    // console.log("PROPS TEST",props);
    // console.log("PROPS TEST THIS",this.props);
    // const roomID = props.match.params.roomID;
    //console.log(roomID)

    const token = localStorage.getItem('token');
    //Video Statusc

    var paramsVideo = props.match.params.video;
    var paramsName = props.match.params.name;
    console.log(paramsName)
    console.log(paramsVideo)
    //
    const roomID = props.match.params.roomID;
    useEffect(() => {
        socketRef.current = io.connect("https://spaces-server.herokuapp.com", { transports: ['websocket', 'polling', 'flashsocket'] });
        navigator.mediaDevices.getUserMedia(
            {
                audio: audioConstraints,
                video: videoConstraints
            }
            //   video: {
            //     width: {min: 640, ideal: 1280, max: 1920},
            //     height: {min: 360, ideal: 720, max: 1080}
            //   }
            //facingMode: "user" 
            // { video: videoConstraints, audio: true }
        ).then(stream => {
            userVideo.current.srcObject = stream;
            if (paramsVideo == "false") {
                userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
                setTimeout(() => { userVideo.current.srcObject.getVideoTracks()[0].stop(); }, 200)
                //userVideo.current.srcObject.getVideoTracks()[0].mute();
                setVideoEnabled(false);
                socketRef.current.emit("Camera off");
            }
            console.log("Yo:", socketRef.current.id);

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                    name: payload.name
                })
                //console.log()
                setPeers(users => [...users, peer]);
            });
            socketRef.current.on("all users", users => {
                console.log("Users: ", users);
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID.socket, socketRef.current.id, stream);
                    peersRef.current = [];
                    peersRef.current.push({
                        peerID: userID.socket,
                        peer,
                        name: userID.name
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })
            socketRef.current.emit("join room", { roomID, name: paramsName, token });
            socketRef.current.on("user Left", payload => {
                //const peer = addPeer(payload.signal, payload.callerID, stream);
                const ptoremove = peersRef.current.filter((user) => user.peerID == payload.callerID)
                console.log("to remove: ", ptoremove)
                peersRef.current = peersRef.current.filter((user) => user.peerID != payload.callerID);
                console.log("peersRef: ", peersRef)
                // peersRef.current.push({
                //     peerID: payload.callerID,
                //     peer,
                // })
                //const peers=peers.filter(())
                console.log("check:", peers)
                var newpeers = [];
                peersRef.current.map(npeer => { newpeers.push(npeer.peer) })
                setPeers(newpeers);
                // console.log("check2:",peers);
                // setTimeout(()=>{setPeers(users=>[...users]);},400);
                //setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                console.log(peersRef.current);
                console.log(payload.id)
                const item = peersRef.current.find(p => p.peerID === payload.id);
                console.log("ITEM", item);
                if (item) {
                    setTimeout(() => { item.peer.signal(payload.signal) }, 500);
                }
                console.log(peersRef.current);
            });

            socketRef.current.on("Camera off", user => {
                console.log("Camera Off: ", user);
                var x = document.getElementById("video" + user);
                if (x) {
                    console.log(x);
                    x.style.display = "none"
                }
                var y = document.getElementById("avatar" + user)
                if (y) {
                    console.log(y);
                    y.style.display = "block"
                }


                //setReloadHelper(!reloadHelper);

            })

            socketRef.current.on("Mute", user => {
                console.log("Mute: ", user);
                var x = document.getElementById("mic" + user);
                console.log(x);
                if (x) {
                    console.log(x);
                    x.className = "fa fa-microphone-slash"
                }
            })

            socketRef.current.on("Unmute", user => {
                console.log("Unmute: ", user);
                var x = document.getElementById("mic" + user);
                if (x) {
                    console.log(x);
                    x.className = "fa fa-microphone"
                }
            })


        })
    }, []);

    useEffect(() => { console.log("New Call") }, [videoEnabled, reloadHelper]);


    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, paramsName })
        })
        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    let sidebar;
    sidebar = <Sidebar />

    return (

        <Fragment>
            <Navbar />
            <div class="wrapper">

                {sidebar}

                <div class="main_content">

                    <Container>
                        <div class="video-box">
                            <StyledVideo muted ref={userVideo} autoPlay playsInline style={{ display: videoEnabled ? "block" : "none" }} />
                            <Avatar src={"http://ui-avatars.com/api/?name=" + paramsName} size="lg" style={{ display: videoEnabled ? "none" : "block" }} />
                            <p> You </p>
                        </div>

                        {
                            console.log("Check Return: ", peers)
                        }
                        {
                            peersRef.current.map((peer, index) => {
                                console.log("New Check 2:", peer.peerID, peer.peer, peer.name)
                                //console.log(peer.stream?.getVideoTracks()[0].readyState);
                                return (
                                    <Fragment>
                                        <div class="video-box">
                                            <Video Key1={peer.peerID} peer={peer.peer} name={peer.name}></Video>
                                        </div>

                                    </Fragment>

                                )
                            }
                            )
                        }
                    </Container>

                    <div class="video-call-button-row">
                        <button id="mute_button"
                            onClick={() => {
                                const enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
                                if (enabled) {
                                    userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
                                    setAudioEnabled(false);
                                    socketRef.current.emit("Mute");
                                } else {
                                    userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
                                    setAudioEnabled(true);
                                    socketRef.current.emit("Unmute");
                                }
                                //console.log("Mic: ",userVideo.current.srcObject.getAudioTracks()[0].getConstraints()); userVideo.current.srcObject.getAudioTracks()[0].getConstraints() == { audio: false } ? userVideo.current.srcObject.getAudioTracks()[0].applyConstraints({ audio: true }) : userVideo.current.srcObject.getAudioTracks()[0].applyConstraints("true");
                            }}
                        >
                            <p>
                                <i class={audioEnabled == true ? "fa fa-microphone" : "fa fa-microphone-slash"} aria-hidden="true"></i>
                            </p>
                        </button>
                        <button id="end_call_button"><Link to="http://localhost:3000/ConferencingPage" target="_self"><p><i class="fas fa-phone"></i></p></Link></button>
                        <button id="video_mode_button"
                            onClick={() => {
                                let enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;
                                if (enabled) {
                                    userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
                                    setTimeout(() => { userVideo.current.srcObject.getVideoTracks()[0].stop(); }, 200)
                                    //userVideo.current.srcObject.getVideoTracks()[0].mute();
                                    setVideoEnabled(false);
                                    socketRef.current.emit("Camera off");
                                } else {
                                    // //window.location.reload();
                                    setVideoEnabled(true);
                                    socketRef.current.emit("disconnectNow");
                                    setTimeout(() => {
                                        socketRef.current = io.connect("https://spaces-server.herokuapp.com", { transports: ['websocket', 'polling', 'flashsocket'] });
                                        navigator.mediaDevices.getUserMedia(
                                            {
                                                audio: audioConstraints,
                                                video: videoConstraints
                                            }
                                        ).then(stream => {
                                            userVideo.current.srcObject = stream;
                                            console.log("Yo:", socketRef.current.id);
                                            socketRef.current.on("user joined", payload => {

                                                const peer = addPeer(payload.signal, payload.callerID, stream);

                                                peersRef.current.push({
                                                    peerID: payload.callerID,
                                                    peer,
                                                    name: payload.name
                                                })
                                                //console.log()
                                                setPeers(users => [...users, peer]);
                                            });
                                            socketRef.current.on("all users", users => {
                                                console.log("Users: ", users);
                                                const peers = [];
                                                users.forEach(userID => {
                                                    const peer = createPeer(userID.socket, socketRef.current.id, stream);
                                                    peersRef.current = [];
                                                    peersRef.current.push({
                                                        peerID: userID.socket,
                                                        peer,
                                                        name: userID.name
                                                    })
                                                    peers.push(peer);
                                                })
                                                setPeers(peers);
                                            })
                                            socketRef.current.emit("join room", { roomID, name: paramsName, token });
                                            socketRef.current.on("user Left", payload => {
                                                //const peer = addPeer(payload.signal, payload.callerID, stream);
                                                const ptoremove = peersRef.current.filter((user) => user.peerID == payload.callerID)
                                                console.log("to remove: ", ptoremove)
                                                peersRef.current = peersRef.current.filter((user) => user.peerID != payload.callerID);
                                                console.log("peersRef: ", peersRef)
                                                // peersRef.current.push({
                                                //     peerID: payload.callerID,
                                                //     peer,
                                                // })
                                                //const peers=peers.filter(())
                                                console.log("check:", peers)
                                                var newpeers = [];
                                                peersRef.current.map(npeer => { newpeers.push(npeer.peer) })
                                                setPeers(newpeers);
                                                // console.log("check2:",peers);
                                                // setTimeout(()=>{setPeers(users=>[...users]);},400);
                                                //setPeers(users => [...users, peer]);
                                            });

                                            socketRef.current.on("receiving returned signal", payload => {
                                                console.log(peersRef.current);
                                                console.log(payload.id)
                                                const item = peersRef.current.find(p => p.peerID === payload.id);
                                                console.log("ITEM", item);
                                                if (item) {
                                                    setTimeout(() => { item.peer.signal(payload.signal) }, 500);
                                                }
                                            });
                                        })

                                    }, 500)


                                }
                            }}
                        ><p><i class={videoEnabled ? "fas fa-video" : "fas fa-video-slash"}></i></p></button>
                    </div>

                </div>
            </div>
        </Fragment >
    );
};

export default Room;













