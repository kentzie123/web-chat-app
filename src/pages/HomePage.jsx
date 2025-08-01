//Components
import Sidebar from '../components/layout/Sidebar';
import ChatNoContent from '../components/layout/ChatNoContent';

const HomePage = () => {
  

  return (
    <div className='flex-1 grid grid-cols-12 bg-base-200 p-10 gap-3'>
      <div className='col-span-3'>
        <Sidebar />
      </div>
      <div className='col-span-9'>
        <ChatNoContent />
      </div>
    </div>
  )
}

export default HomePage