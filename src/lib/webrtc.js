export function createPeerConnection(setRemoteVideoStream, myVideoStream) {
  
  const iceServersConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const pc = new RTCPeerConnection(iceServersConfig);

  pc.ontrack = (event) => {
    const remoteStream = event.streams[0];
    setRemoteVideoStream(remoteStream);
  };

  myVideoStream.getTracks().forEach((track) => pc.addTrack(track, myVideoStream));

  return pc;
}
