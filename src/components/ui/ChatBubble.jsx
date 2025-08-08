// Time formatter
import { formatChatTimestamp } from "../../lib/timeFormat";

const ChatBubble = ({ message, user, isMine, ref, openImageViewer }) => {
  
  return (
    <div ref={ref} className={`chat ${isMine ? "chat-end" : "chat-start"} `}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={user.profile_pic ? user.profile_pic :"/default.png"}
          />
        </div>
      </div>
      <div className="ps-2 pb-1 chat-header">
        <time className="text-xs opacity-50">
          {message.created_at && formatChatTimestamp(message.created_at)}
        </time>
      </div>
      <div className="chat-bubble">
        {message.image && (
          <img
            onClick={openImageViewer}
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
          />
        )}
        {message.text && <p className="break-words">{message.text}</p>}
      </div>
      <div className="text-base-content text-xs opacity-70">{message.isSending ? 'Sending...' : ''}</div>
    </div>
  );
};

export default ChatBubble;
