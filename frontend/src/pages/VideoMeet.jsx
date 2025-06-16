import React, { useEffect } from 'react'
import { useRef,useState } from 'react';
import { io } from 'socket.io-client';
import { UseUserContext } from '../context/UserContext';

var connections={};

// A STUN server helps devices behind NAT discover their public IP address and port so they can establish peer-to-peer connections, such as in video calls or WebRTC applications
const peerConfigConnections={
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}

function VideoMeet() {
    var socketRef=useRef();
    let socketIdRef=useRef();
    let localVideoRef=useRef();
    let [videoAvaiable,setVideoAvaiable]=useState(true);
    let [audioAvaiable,setAudioAvaiable]=useState(true);
    let [video,setVideo]=useState([]);
    let [audio,setAudio]=useState();
    let [screen,setScreen]=useState();
    let [showModel,setShowModel]=useState();
    let[screenAvaiable,setScreenAvaiable]=useState();
    let [messages,setMessages]=useState([]);
    let [message,setMessage]=useState("");
    let [newMessages,setNewMessages]=useState(0);
    let [askForUserName,setAskForUserName]=useState(true);//
    let [userName,setUserName]=useState("");
    let [videos,setVideos]=useState([]);
    const videoRef=useRef([]);
    const { uToken,backendUrl,user}=UseUserContext();


    const getPermission= async()=>{
        try {
            const videoPermission=await navigator.mediaDevices.getUserMedia({video:true});
            if(videoPermission){
                setVideoAvaiable(true);
            }else setVideoAvaiable(false);

            const audioPermission=await navigator.mediaDevices.getUserMedia({audio:true});
            if(audioPermission){
                setAudioAvaiable(true);
            }else setAudioAvaiable(false);

            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvaiable(true);
            }else setScreenAvaiable(false);

            if(videoAvaiable || audioAvaiable){
                const userMediaStream=await navigator.mediaDevices.getUserMedia({video:videoAvaiable,audio:audioAvaiable})

                if(userMediaStream){
                    window.localStream=userMediaStream;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject=userMediaStream;
                    }
                }
            }

        } catch (error) {
            console.log(error);
        }

    }


    let getUserMedia=()=>{
        if((video && videoAvaiable) || (audio && audioAvaiable)){
            navigator.mediaDevices.getUserMedia({video:video,audio:audio})
               .then(()=>{})
               .then(()=>{})
               .catch((err)=>console.log(err));
        }else{
            try {
                let tracks=localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track=>track.stop());
            } catch (error) {
                
            }
        }
    }

    useEffect(()=>{
        getPermission();
    },[]);

    useEffect(()=>{
        if(video!==undefined && audio!==undefined){
            getUserMedia();
        }
    },[audio,video]);

    let gotMessageFromServer=()=>{

    }
    let addMessage=()=>{

    }

    let connectToSocket=()=>{
        socketRef.current=io.connect(backendUrl,{source:false})
    
        socketRef.current.on("signal",gotMessageFromServer);
        socketRef.current.on("connect",()=>{
            socketRef.current.emit("join-call",window.location.href);
            socketIdRef.current=socketRef.current.id;
            socketRef.current.on("chat-message",addMessage);
            socketRef.current.on("user-left",(id)=>{
                setVideo((videos)=>videos.filter((video)=>video.socketId!==id))
            });
            socketRef.current.on("user-join",(id,clients)=>{
                clients.forEach((socketListId)=>{
                    connections[socketListId=new RTCPeerConnection(peerConfigConnections)];
                    connections[socketListId].onicecandidate=(event)=>{
                        if(event.candidate!= null){
                            socketRef.current.emit("signal",socketListId,JSON.stringify({'ice':event.candidate}));
                        }
                    }
                    connections[socketListId].onaddsteam=(event)=>{

                        let videoExists=videoRef.current.find(video=>video.socketId===socketListId);
                        if(videoExists){
                            setVideo(videos=>{
                                const updateVideos=videos.map(video=>video.socketId===socketListId? {...video,stream:event.stream}:video)
                            });
                            videoRef.current=updateVideos;
                            return updateVideos;
                        }else{
                            let newVideo={
                                socketId:socketListId,
                                stream:event.stream,
                                autoPlay:true,
                                playsinline:true
                            }

                            setVideo(videos=>{
                                const updatedVideos=[...videos,newVideo];
                                videoRef.current=updatedVideos;
                                return updatedVideos;
                            })
                        }
                    }
                    if(window.localStream!==undefined && window.localStream!==null){
                        connections[socketListId].addStream(window.localStream);
                    }else{
                        // 
                        //

                    }
                });
                if(id===socketIdRef.current){
                    for(let id2 in connections){
                        if(id2===socketIdRef.current)continue;
                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (error) {
                            connections[id2].createOffer().then((description)=>{
                                connections[id2].setLocalDescription(description)
                                .then(
                                    ()=>{socketRef.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2]}))}
                                )
                                .catch(e=>console.log(e))
                            })
                        }
                    }
                }
            });
        })
    
    }


    let getMedia=()=>{
        setAudio(audioAvaiable);
        setVideo(videoAvaiable);
        connectToSocket();
    }


  return (
    <div>
        <input value={userName} onChange={(e)=>setUserName(e.target.value)}/>
        <button onClick={getMedia}>Connect</button>
        <video ref={localVideoRef} muted autoPlay></video>
    </div>
  )
}

export default VideoMeet