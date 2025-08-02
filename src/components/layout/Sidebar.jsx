// Lucide icons
import { Users  } from 'lucide-react';

// Store
import { useChatStore } from '../../store/useChatStore';

// Hookes
import { useEffect } from 'react';

// Skeleton
import SidebarSkeleton from './skeleton/SidebarSkeleton';

const Sidebar = () => {
    const { getUsers, users, isUsersLoading, getMessagesFromTo, isMessagesLoading, selectedUser } = useChatStore();

    useEffect(()=>{
        getUsers();
    },[]);


    if(isUsersLoading){
        return <SidebarSkeleton/>;
    }

    return (
        <div className='bg-base-100 rounded-lg h-full'>
            <div className='p-4'>
                <div className='flex items-center gap-2'>
                    <Users />   
                    <div className='font-bold'>Contacts</div>
                </div>
                <div className='flex items-center mt-3 gap-2'>
                    <input type="checkbox" className="checkbox checkbox-sm"/>
                    <div className='text-sm'>Show online only <span className='text-[10px] text-base-content/60'>(0 online)</span></div>
                </div>
            </div>

            <div className='border-t border-t-base-300 py-6'>
            {users.map((user, i)=> (
                <button key={i} onClick={()=> getMessagesFromTo(user)} type='button' className={`${selectedUser?.id === user.id ? 'bg-base-300' : ''} hover:bg-base-300/60 flex items-center gap-2 px-4 py-3 cursor-pointer select-none w-full`}>
                    <div className='relative'>
                        <img className='size-10 rounded-full' src={!user.profile_pic ? '/default.png' : user.profile_pic} alt="profile" />
                        <div className='absolute right-0 bottom-0 size-3 bg-green-700 rounded-full border-2 border-base-200'></div>
                    </div>
                    <div>
                        <div className='font-medium text-start'>{user.fullname}</div>
                        <div className='text-sm text-base-content/60 text-start'>Online</div>
                    </div>
                </button>
            ))}
            </div>
        </div>
        
    )
}

export default Sidebar