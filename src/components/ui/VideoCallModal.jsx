// Lucide icons
import { Mic, MicOff, Video, VideoOff, PhoneOff  } from 'lucide-react';

// Hooks
import { useState, useRef, useEffect } from 'react';

const VideoCallModal = () => {
  const myVideoRef = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const startStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    myVideoRef.current.srcObject = stream;
    // stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));
  };

  useEffect(()=>{
    startStream();
  },[])
  

  return (
    <div className="fixed w-screen h-screen flex justify-center items-center bg-black/80 z-100">
      {/* <video src="" className="scale-x-[-1] w-full max-w-[500px]" autoPlay playsInline/> */}
      <div className="relative h-[60%] w-full max-w-[800px]">
         <video ref={myVideoRef} className="w-full h-full bg-white rounded-lg" autoPlay playsInline></video>  {/*my camera */}
        <div className="absolute bottom-3 right-1 rounded-lg border-2 border-primary bg-base-100 h-35 w-50"></div>  {/*other user camera */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 p-2 rounded-full bg-gray-900/60">
          <button onClick={()=> setIsMicOn(prev => !prev)} type="button" className={`btn ${!isMicOn ? 'btn-error' : ''} btn-circle rounded-full`}>{isMicOn ? <Mic className='size-4'/> : <MicOff className='size-4'/>}</button>
          <button onClick={()=> setIsCamOn(prev => !prev)} type="button" className={`btn ${!isCamOn ? 'btn-error' : ''} btn-circle rounded-full`}>{isCamOn ? <Video className='size-4'/> : <VideoOff className='size-4'/>}</button>
          <button type="button" className="btn btn-error btn-circle rounded-full"><PhoneOff className='size-4'/></button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
