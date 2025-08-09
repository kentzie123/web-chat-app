import { useEffect, useRef } from "react";
import { createPeerConnection } from "../../lib/webrtc";
import { useAuthStore } from "../../store/useAuthStore";

export default function VideoCallModal({ roomId, onClose }) {
  const { socket } = useAuthStore();
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      // 1. Create PeerConnection
      pcRef.current = createPeerConnection(remoteVideoRef, roomId, socket);

      // 2. Get my camera + mic
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        myVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
        return;
      }

      // 3. Handle incoming offer
      socket.on("offer", async (offer) => {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId });
      });

      // 4. Handle incoming answer
      socket.on("answer", async (answer) => {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // 5. Handle incoming ICE candidates
      socket.on("ice-candidate", async (candidate) => {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });

      // 6. Join the call room
      socket.emit("join-room", roomId);
    };

    init();

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId, socket]);

  // 📞 Start call (caller clicks)
  const callUser = async () => {
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { offer, roomId });
  };

  return (
    <div className="video-call">
      <video ref={myVideoRef} autoPlay muted playsInline className="my-video" />
      <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
      <div className="controls">
        <button onClick={callUser}>📞 Call</button>
        <button onClick={onClose}>❌ End</button>
      </div>
    </div>
  );
}
