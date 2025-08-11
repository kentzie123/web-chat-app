import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
        {/* Remote user's camera — full background */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />

        {/* My camera — floating preview (responsive, aspect-locked) */}
        <div className="absolute bottom-4 right-4 w-[clamp(96px,18vw,240px)] pb-[75%] rounded-lg overflow-hidden border-2 border-primary shadow-lg z-10">
          <video
            ref={localVideoRef}
            muted
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-3 rounded-full bg-gray-900/70 backdrop-blur-sm shadow-lg z-20">
          <button
            onClick={toggleMic}
            aria-label="Toggle microphone"
            type="button"
            className={`btn ${!isMicOn ? "btn-error" : ""} btn-circle`}
          >
            {isMicOn ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={toggleCam}
            aria-label="Toggle camera"
            type="button"
            className={`btn ${!isCamOn ? "btn-error" : ""} btn-circle`}
          >
            {isCamOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            aria-label="Hang up"
            className="btn btn-error btn-circle"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
