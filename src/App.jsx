import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import Topnav from './components/Topnav';

// Pages
import HomePage from './pages/HomaPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Store
import { useAuthStore } from './store/useAuthStore';

// Toast
import { Toaster } from 'react-hot-toast';

function App() {  
  const { authUser } = useAuthStore();

  

  return (
    <div data-theme={'dracula'} className='flex flex-col min-h-screen'>
      <Toaster />
      <Topnav />
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path='/signup' element={ !authUser ? <SignUpPage /> : <HomePage /> } />
        <Route path='/login' element={ !authUser ? <LoginPage />: <HomePage /> } />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to={'/login'} /> } />
      </Routes>
    </div>
  )
}

export default App
