import { useEffect, useRef } from "react";
import { X, MicOff, VideoOff } from "lucide-react"; // Control icons
import { createPeerConnection } from "../../lib/webrtc";
import { useAuthStore } from "../../store/useAuthStore";

export default function VideoCallModal({ roomId, onClose }) {
  const { socket } = useAuthStore();
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      pcRef.current = createPeerConnection(remoteVideoRef, roomId, socket);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) =>
          pcRef.current.addTrack(track, stream)
        );
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
        return;
      }

      socket.on("offer", async (offer) => {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit("answer", { answer, roomId });
      });

      socket.on("answer", async (answer) =>
        pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
      );

      socket.on("ice-candidate", async (candidate) => {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });

      socket.emit("join-room", roomId);
    };

    init();
    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId, socket]);

  const callUser = async () => {
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("offer", { offer, roomId });
  };

  return (
    <dialog className="modal modal-open">
      <form method="dialog" className="modal-box p-0 bg-black">
        <div className="relative flex justify-center items-center h-[70vh]">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-28 h-28 rounded-full border-4 border-white absolute bottom-6 right-6"
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button className="btn btn-circle btn-sm bg-white">
              <MicOff size={20} />
            </button>
            <button className="btn btn-circle btn-sm bg-white">
              <VideoOff size={20} />
            </button>
            <button
              onClick={onClose}
              className="btn btn-error btn-circle btn-sm text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
