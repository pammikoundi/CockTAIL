export default function Message({ role, content }) {
  return (
    <div className="flex items-start gap-4 p-4">
      <div>
        <img
          src={role === "assistant" ? "./ui/icons/bot.png" : "./ui/icons/user.png"}
          className="w-8 h-8 rounded-full"
          alt="profile avatar"
        />
      </div>
      <div className="flex-1">
        <p className="text-gray-800">{content}</p>
      </div>
    </div>
  );
}