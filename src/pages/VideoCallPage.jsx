// MyCamera.jsx
import { useEffect, useRef } from "react";

const VideoCallPage = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or error:", err);
      }
    };

    getCamera();
  }, []);

  return (
    <div className="flex-1 flex justify-center items-center h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-xl shadow-xl w-[300px] h-[200px] scale-x-[-1]"
      />
    </div>
  );
};

export default VideoCallPage;
