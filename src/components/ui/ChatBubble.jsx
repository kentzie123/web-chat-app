// Time formatter
import { formatTo12Hour } from "../../lib/timeFormat";

const ChatBubble = ({ message, user }) => {
  return (
    <div
      className={`chat ${
        message.senderId === user.id ? "chat-end" : "chat-start"
      } `}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={!user.profile_pic ? "/default.png" : user.profile_pic}
          />
        </div>
      </div>
      <div className="ps-2 pb-1 chat-header">
        <time className="text-xs opacity-50">
          {formatTo12Hour(message.created_at)}
        </time>
      </div>
      <div className="chat-bubble">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
      <div className="text-[10px]">Delivered</div>
    </div>
  );
};

export default ChatBubble;
