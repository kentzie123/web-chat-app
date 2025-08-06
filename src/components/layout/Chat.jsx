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
  const {
    selectedUser,
    selectedUserMessages,
    closeChat,
    addMessageToChat,
    setLatestMessage,
    latestMessage,
    handleScrollEvent,
  } = useChatStore();
  const { authUser, socket, onlineUsers } = useAuthStore();

  const messageContainerRef = useRef();
  const bottomRef = useRef(null);

  // Scroll bottom
  useEffect(() => {
    if (!latestMessage || !selectedUserMessages.length) return;

    const latestTime = new Date(latestMessage.created_at);
    const lastMessageTime = new Date(
      selectedUserMessages[selectedUserMessages.length - 1].created_at
    );
    // Only scroll if the new message is newer than the current last message
    if (latestTime >= lastMessageTime) {
      bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }
    setLatestMessage(null);
  }, [latestMessage, selectedUserMessages]);


  if (!selectedUser) {
    <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col bg-base-100 rounded-lg h-full">
      {/* Header */}
      <div className="p-3 border-b border-b-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="size-10 rounded-full"
              src={
                selectedUser.profile_pic
                  ? selectedUser.profile_pic
                  : "/default.png"
              }
              alt="profile"
            />
            <div>
              <div className="font-medium">{selectedUser.fullname}</div>
              <div className="text-base-content/60 text-sm">
                {onlineUsers.includes(selectedUser.id) ? "Online" : "Offline"}
              </div>
            </div>
          </div>
          <button onClick={closeChat} className="btn btn-sm btn-ghost">
            <X className="cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Messages container with scroll */}
      <div
        ref={messageContainerRef}
        onScroll={() => handleScrollEvent(messageContainerRef.current)}
        className="flex-1 p-3 space-y-5 overflow-y-auto"
      >
        {selectedUserMessages.map((message, i) => (
          <ChatBubble
            key={i}
            message={message}
            user={message.sender_id === authUser.id ? authUser : selectedUser}
            isMine={message.sender_id === authUser.id}
            ref={i === selectedUserMessages.length - 1 ? bottomRef : null}
          />
        ))}
      </div>

      {/* Input */}
      <div>
        <SendMessage />
      </div>
    </div>
  );
};

export default Chat;
