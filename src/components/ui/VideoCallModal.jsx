import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const VideoCallModal = () => {
  const myVideoRef = useRef(null);
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
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    };

    startStream();

    return () => {
      // stop all tracks when closing modal
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn(prev => !prev);
  };

  const toggleCam = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    setIsCamOn(prev => !prev);
  };

  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-black/80 z-[100]">
      <div className="relative h-[60%] w-full max-w-[800px] bg-black rounded-lg ">
        <video
          ref={myVideoRef}
          className="w-full h-full scale-x-[-1]"
          autoPlay
          playsInline
        />
        
        {/* Other user camera */}
        <div className="absolute bottom-3 right-1 rounded-lg border-2 border-primary bg-base-100 h-35 w-50"></div>
        
        {/* Controls */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 p-2 rounded-full bg-gray-900/60">
          <button
            onClick={toggleMic}
            type="button"
            className={`btn ${!isMicOn ? "btn-error" : ""} btn-circle rounded-full`}
          >
            {isMicOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          </button>
          <button
            onClick={toggleCam}
            type="button"
            className={`btn ${!isCamOn ? "btn-error" : ""} btn-circle rounded-full`}
          >
            {isCamOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
          </button>
          <button
            type="button"
            className="btn btn-error btn-circle rounded-full"
          >
            <PhoneOff className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
