import { Routes, Route, Navigate } from "react-router-dom";
import Topnav from "./components/layout/Topnav";
import Loading from "./components/ui/Loading";
import VideoCallModal from "./components/ui/VideoCallModal";
import IncomingCall from "./components/ui/IncomingCall";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useVideoCallStore } from "./store/useVideoCallStore";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { isCalling, callerInfo } = useVideoCallStore();
  const { theme } = useThemeStore();

  const audioRef = useRef(new Audio("/incomingCall.mp3"));

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Unlock audio after first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      audioRef.current.muted = true;
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.muted = false;
          console.log("Audio unlocked");
        })
        .catch(() => {
          console.log("Audio unlock failed");
        });
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio, { once: true });
  }, []);

  const playRingtone = () => {
    audioRef.current.loop = true;
    audioRef.current.play().catch((err) => {
      console.warn("Ringtone play blocked:", err);
    });
  };

  if (isCheckingAuth && !authUser) {
    return <Loading />;
  }

  return (
    <div data-theme={theme} className="relative flex flex-col min-h-screen">
      <Toaster />
      <Topnav />
      {isCalling && <VideoCallModal />}
      {callerInfo && <IncomingCall />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
