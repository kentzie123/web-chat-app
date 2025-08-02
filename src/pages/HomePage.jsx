//Components
import Sidebar from '../components/layout/Sidebar';
import ChatNoContent from '../components/layout/ChatNoContent';
import Chat from '../components/layout/Chat';

//Store
import { useChatStore } from '../store/useChatStore';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className='flex-1 grid grid-cols-12 bg-base-200 px-5 py-5 sm:px-10 lg:px-15 gap-3'>
      <div className='col-span-12 md:col-span-4'>
        <Sidebar />
      </div>
      <div className='hidden md:block col-span-8 max-h-[calc(100vh-6.4rem)]'>
        {selectedUser ? <Chat /> : <ChatNoContent />}
      </div>
    </div>
  )
}

export default HomePage