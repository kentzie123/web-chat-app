import { io } from "socket.io-client";

// For routing
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Topnav from "./components/layout/Topnav";
import Loading from "./components/ui/Loading";
import ChatMobile from "./components/layout/ChatMobile";

// Pages
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

// Store
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useChatStore } from "./store/useChatStore";

// Toast
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const { selectedUser } = useChatStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  

  if (isCheckingAuth && !authUser) {
    return <Loading />;
  }

  return (
    <div data-theme={theme} className="relative flex flex-col min-h-screen">
      <Toaster />
      <Topnav />
      {selectedUser && (
        <div className="fixed top-17 inset-0 z-50 md:hidden mx-3 my-3 sm:mx-10">
          <ChatMobile />
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <HomePage />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <HomePage />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
