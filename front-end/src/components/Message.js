import botIcon from "./ui/icons/bot.png";
import userIcon from "./ui/icons/user.png";

export default function Message({ role, content }) {
  return (
    <div className="flex items-start gap-4 p-4">
      <div>
        <img
          src={role === "assistant" ? botIcon : userIcon}
          className="w-8 h-8 rounded-fit"
          alt="profile avatar"
        />
      </div>
      <div className="flex-1">
        <p className="text-gray-800">{content}</p>
      </div>
    </div>
  );
}
