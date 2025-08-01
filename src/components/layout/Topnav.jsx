// For routing
import { Link } from "react-router-dom"

// Lucide icons
import { MessageSquare, Settings, User, LogOut } from 'lucide-react';


// Store
import { useAuthStore } from "../../store/useAuthStore"; 


const Topnav = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className='bg-base-100/80 border border-base-300 px-4 py-3'>
      <div className="flex justify-between items-center">
        <Link className="hover:opacity-80" to={'/'}>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <MessageSquare className="w-5 h-5 text-primary"/>
            </div>
            <h1 className="text-lg font-bold">Chatapp</h1>
          </div>
        </Link>

        <div className="space-x-3">
          <Link className="btn btn-sm" to={'/settings'}>
            <Settings className="size-4"/>
            <div>Settings</div>
          </Link>
          {authUser &&
            <>
              <Link className="btn btn-sm" to={'/profile'}>
                <User className="size-4"/>
                <div>Profile</div>
              </Link>
              <button onClick={logout} type="button" className="btn btn-sm" to={'/settings'}>
                <LogOut className="size-4"/>
                <div>Logout</div>
              </button>
            </>
          }
        </div>
      </div>
      
    </div>
  )
}

export default Topnav