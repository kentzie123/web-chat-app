import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import Draggable from "react-draggable";

// Stores
import { useVideoCallStore } from "../../store/useVideoCallStore";

const VideoCallModal = () => {
  const { setIsCalling } = useVideoCallStore();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null); // for the other camera
  const streamRef = useRef(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // For demo: show same stream as remote (until WebRTC is set up)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    };

    startStream();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn((prev) => !prev);
  };

  const toggleCam = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    setIsCamOn((prev) => !prev);
  };

  const endCall = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsCalling(false);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-[100]">
      <div className="relative h-[60%] w-full max-w-[800px] rounded-lg overflow-hidden bg-black">
        {/* Remote user's camera (full background) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          autoPlay
          playsInline
        />

        {/* My camera (floating preview) */}
        <Draggable bounds="parent">
          <div className="absolute bottom-4 right-4">
            <video
              ref={localVideoRef}
              className="h-32 w-48 rounded-lg border-2 border-primary bg-base-100 object-cover scale-x-[-1] shadow-lg cursor-move"
              autoPlay
              playsInline
            />
          </div>
        </Draggable>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-3 rounded-full bg-gray-900/70 backdrop-blur-sm shadow-lg">
          <button
            onClick={toggleMic}
            type="button"
            className={`btn ${!isMicOn ? "btn-error" : ""} btn-circle`}
          >
            {isMicOn ? (
              <Mic className="size-5" />
            ) : (
              <MicOff className="size-5" />
            )}
          </button>
          <button
            onClick={toggleCam}
            type="button"
            className={`btn ${!isCamOn ? "btn-error" : ""} btn-circle`}
          >
            {isCamOn ? (
              <Video className="size-5" />
            ) : (
              <VideoOff className="size-5" />
            )}
          </button>
          <button
            onClick={endCall}
            type="button"
            className="btn btn-error btn-circle"
          >
            <PhoneOff className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
