import { useEffect, useRef, useState } from "react";
import { createPeerConnection } from "../../lib/webrtc";
import { useAuthStore } from "../../store/useAuthStore";
import { Phone, PhoneOff } from "lucide-react";

export default function VideoCallModal({ roomId, isCaller, onClose }) {
  const { socket, authUser } = useAuthStore();
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const ringtoneRef = useRef(null);

  const [incomingOffer, setIncomingOffer] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  useEffect(() => {
    pcRef.current = createPeerConnection(remoteVideoRef, roomId, socket);

    socket.on("offer", ({ offer, caller }) => {
      if (!isCaller) {
        setIncomingOffer({ offer, caller });
        playRingtone();
        showIncomingToast(caller);
      }
    });

    socket.on("answer", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    socket.on("call-declined", () => {
      stopRingtone();
      alert("Call declined");
      onClose();
    });

    socket.emit("join-room", roomId);

    return () => {
      stopRingtone();
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-declined");
    };
  }, [roomId, socket, isCaller, onClose]);

  const startStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    myVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));
  };

  const callUser = async () => {
    await startStream();
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { offer, roomId, caller: authUser });
    setIsInCall(true);
  };

  const acceptCall = async () => {
    stopRingtone();
    await startStream();
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer));
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit("answer", { answer, roomId });
    setIncomingOffer(null);
    setIsInCall(true);
  };

  const declineCall = () => {
    stopRingtone();
    socket.emit("call-declined", { roomId });
    setIncomingOffer(null);
    onClose();
  };

  const playRingtone = () => {
    ringtoneRef.current = new Audio("/ringtone.mp3");
    ringtoneRef.current.loop = true;
    ringtoneRef.current.play().catch(() => {});
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const showIncomingToast = (caller) => {
    if (window.toast) {
      window.toast.success(`${caller.fullname} is calling...`, {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg shadow-lg p-4 w-full max-w-4xl flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <video ref={myVideoRef} autoPlay muted playsInline className="bg-black rounded-lg" />
          <video ref={remoteVideoRef} autoPlay playsInline className="bg-black rounded-lg" />
        </div>

        <div className="mt-4 flex justify-center gap-4">
          {!isCaller && incomingOffer && (
            <>
              <button className="btn btn-success gap-2" onClick={acceptCall}>
                <Phone className="w-5 h-5" /> Accept
              </button>
              <button className="btn btn-error gap-2" onClick={declineCall}>
                <PhoneOff className="w-5 h-5" /> Decline
              </button>
            </>
          )}

          {isCaller && !isInCall && (
            <button className="btn btn-success gap-2" onClick={callUser}>
              <Phone className="w-5 h-5" /> Call
            </button>
          )}

          {isInCall && (
            <button className="btn btn-error gap-2" onClick={onClose}>
              <PhoneOff className="w-5 h-5" /> End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
