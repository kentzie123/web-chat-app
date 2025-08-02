// Lucide icon
import { X } from "lucide-react";

// Store
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

// Components
import ChatBubble from "../ui/ChatBubble";
import SendMessage from "../ui/SendMessage";
import ChatSkeleton from "./skeleton/ChatSkeleton";

// Hooks 
import { useEffect, useRef } from "react";


const Chat = () => {
  const { selectedUser, selectedUserMessages, closeChat } = useChatStore();
  const { authUser } = useAuthStore();

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUserMessages]);


  if(!selectedUser){
    <ChatSkeleton />
  } 

  return (
    <div className="flex flex-col bg-base-100 rounded-lg h-full">
      {/* Header */}
      <div className="p-3 border-b border-b-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="size-10 rounded-full"
              src={selectedUser.profile_pic ? selectedUser.profile_pic : "/default.png"}
              alt="profile"
            />
            <div>
              <div className="font-medium">{selectedUser.fullname}</div>
              <div className="text-base-content/60 text-sm">Offline</div>
            </div>
          </div>
          <button onClick={closeChat} className="btn btn-sm btn-ghost">
            <X className="cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Messages container with scroll */}
      <div className="flex-1 p-3 space-y-5 overflow-y-auto">
        {selectedUserMessages.map((message, i) => (
            <ChatBubble
              key={i}
              message={message}
              user={message.sender_id === authUser.id ? authUser : selectedUser}
              isMine={message.sender_id === authUser.id}
            />
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div>
        <SendMessage />
      </div>
    </div>
  );
};

export default Chat;
