import { Link } from "react-router-dom"
import { MessageSquare, Settings } from 'lucide-react';

const Topnav = () => {
  return (
    <div className='border border-base-300 px-4 py-3'>
      <div className="flex justify-between items-center">
        <Link className="hover:opacity-80" to={'/'}>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <MessageSquare className="w-5 h-5 text-primary"/>
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </div>
        </Link>

        <div className="space-x-3">
          <Link className="btn btn-sm" to={'/settings'}>
            <Settings className="w-4 h-4"/>
            <div>Settings</div>
          </Link>
        </div>
      </div>
      
    </div>
  )
}

export default Topnav