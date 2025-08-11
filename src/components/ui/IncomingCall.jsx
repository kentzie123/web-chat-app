// Stores
import { useVideoCallStore } from "../../store/useVideoCallStore";

// Lucide icons
import { X, Phone, PhoneOff } from "lucide-react";

const IncomingCall = () => {
  const { callerInfo } = useVideoCallStore();
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-[100]">
      <div className="relative flex flex-col justify-center items-center bg-base-100 py-5 px-13 rounded-lg space-y-3">
        <img
          className="size-25 border-4 border-primary rounded-full"
          src="https://res.cloudinary.com/dzsfeypki/image/upload/v1754731890/web-chat-app/profile-pictures/qxymin4xyaeeru0jgmlb.jpg"
          alt="caller-profile"
        />
        <div>Incoming Call</div>
        <div className="font-bold">Kent Adriane Goc-ong</div>
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            className="btn btn-error btn-circle"
          >
            <PhoneOff className="size-4" />
          </button>
          <button
            type="button"
            className="btn btn-success btn-circle"
          >
            <Phone className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
