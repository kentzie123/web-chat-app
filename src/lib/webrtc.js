import { socket } from "../socket/socket";

export function createPeerConnection(remoteVideoRef, roomId) {
  const pc = new RTCPeerConnection();

  // When remote track arrives → attach to <video>
  pc.ontrack = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  // Send my ICE candidates to the other peer
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { candidate: event.candidate, roomId });
    }
  };

  return pc;
}
