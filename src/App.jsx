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
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { isCalling, callerInfo, setMyVideoStream } = useVideoCallStore();
  const { theme } = useThemeStore();

  const localVideoRef = useRef(null);
  const streamRef = useRef(null); // for resetting the stream

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
          setMyVideoStream(stream);
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

  if (isCheckingAuth && !authUser) {
    return <Loading />;
  }

  return (
    <div data-theme={theme} className="relative flex flex-col min-h-screen">
      <button type="button"></button>
      <Toaster />
      <Topnav />
      {isCalling && <VideoCallModal localVideoRef={localVideoRef} streamRef={streamRef} />}
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
