import { io } from "socket.io-client";

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
import { useEffect } from "react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { isCalling, callerInfo } = useVideoCallStore();
  const primeRingtone = useVideoCallStore((state) => state.primeRingtone);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Fallback: Prime on first user click if not already primed
    const unlock = () => primeRingtone();
    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, [primeRingtone]);

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
