// For routing
import { Link } from "react-router-dom"

// Lucide icons
import { MessageSquare, Settings, User, LogOut, ChevronDown } from 'lucide-react';


// Store
import { useAuthStore } from "../../store/useAuthStore"; 


const Topnav = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className='bg-base-100 border border-base-300 px-4 py-3'>
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
              {/* <Link className="btn btn-sm" to={'/profile'}>
                <User className="size-4"/>
                <div>Profile</div>
              </Link> */}
              <button onClick={logout} type="button" className="btn btn-sm" to={'/settings'}>
                <LogOut className="size-4"/>
                <div>Logout</div>
              </button>

              <div className="relative dropdown dropdown-end">
                <img tabIndex={0} role="button" className="btn btn-circle" src={authUser.profile_pic} alt="profile"/>
                <ChevronDown className="absolute bottom-[-3px] right-[-3px] bg-base-300 rounded-full size-4.5 border-3 border-base-100"/>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  <li><a>Item 1</a></li>
                  <li><a>Item 2</a></li>
                </ul>
              </div>
            </>
          }
        </div>
      </div>
      
    </div>
  )
}

export default Topnav