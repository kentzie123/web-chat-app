// Lucide icons
import { Send, Image, X } from "lucide-react";

// Hooks
import { useRef } from "react";

// Store
import { useChatStore } from "../../store/useChatStore";

// Toast 
import toast from "react-hot-toast";

const SendMessage = () => {
  const selectPic = useRef();
  const { sendMessage, selectedUser, message, setMessage } = useChatStore();


  const handleSelectImage = (imageFile) => {
    console.log(imageFile);
    const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if(!supportedTypes.includes(imageFile.type)){
      console.log('image not supported');
      
      toast.error("File type not supported!");
      return;
    }

    if (imageFile.size / (1024 * 1024) > 10) {
      toast.error("File size exceeds 10MB!");
      return;
    }

    const reader = new FileReader(); // Create a file reader
    // This will run once the file is fully read
    reader.onloadend = () => {
      setMessage({
        ...message,
        image: reader.result, // `reader.result` contains the base64 image
      });
    };

    // Start reading the image file (this triggers onloadend later)
    if (imageFile) {
      reader.readAsDataURL(imageFile); // Convert image file to base64
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(message, selectedUser.id);

    // For clearing
    setMessage({ text: "", image: null });
    if (selectPic.current) {
      selectPic.current.value = "";
    }
  };

  const closeImagePreview = () => {
    setMessage({ ...message, image: null });

    // Reset file input so same file can be selected again
    if (selectPic.current) {
      selectPic.current.value = "";
    }
  };

  return (
    <div className="p-3">
      {message.image && (
        <div className="relative w-fit mb-2">
          <button
            onClick={closeImagePreview}
            className="absolute top-[-9px] right-[-9px] size-5 btn btn-circle cursor-pointer rounded-full"
          >
            <X className="size-3" />
          </button>
          <img
            className="size-23 rounded-lg object-cover"
            src={message.image}
            alt="preview"
          />
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          value={message.text}
          type="text"
          placeholder="Send a message..."
          className="input flex-grow"
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
        />
        <input
          ref={selectPic}
          onChange={(e) => {
            handleSelectImage(e.target.files[0]);
          }}
          type="file"
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => selectPic.current.click()}
          type="button"
          className="btn btn-circle"
        >
          <Image
            className={`size-5 ${message.image ? "text-secondary" : ""}`}
          />
        </button>
        <button
          disabled={!message.text && !message.image}
          type="submit"
          className="btn btn-circle"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
