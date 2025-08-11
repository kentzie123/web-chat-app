// For routing
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Topnav from "./components/layout/Topnav";
import Loading from "./components/ui/Loading";
import VideoCallModal from "./components/ui/VideoCallModal";
import IncomingCall from "./components/ui/IncomingCall";

// Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

// Store
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useVideoCallStore } from "./store/useVideoCallStore";

// Toast
import { Toaster } from "react-hot-toast";

// Hooks
import { useEffect, useRef } from "react";

function App() {
  const { interactClick } = useRef(null);
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { isCalling, callerInfo } = useVideoCallStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const audioRef = new Audio("/incomingCall.mp3");

  useEffect(() => {
    const unlockAudio = () => {
      audioRef.current.muted = true;
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.muted = false;
        console.log("Audio unlocked");
      });
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
  }, []);

  const playRingtone = () => {
    audioRef.current.play();
  };

  useEffect(() => {
    if (interactClick?.current) {
      console.log('Button click');
      
      interactClick.current.click();
    }
  }, [interactClick]);

  if (isCheckingAuth && !authUser) {
    return <Loading />;
  }

  return (
    <div data-theme={theme} className="relative flex flex-col min-h-screen">
      <button className="hidden" onClick={playRingtone}>Test Ringtone</button>
      <Toaster />
      <Topnav />
      {isCalling && <VideoCallModal />}
      {callerInfo && <IncomingCall />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
